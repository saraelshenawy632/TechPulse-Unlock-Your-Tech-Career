import pandas as pd

from database.db import engine
from warehouse.db import dw_engine


def load_platforms():

    query = """
        SELECT DISTINCT Platform
        FROM CompanySources
        WHERE Platform IS NOT NULL
    """

    df = pd.read_sql(query, engine)

    if df.empty:
        print("⚠️ No platforms found")
        return

    df = df.rename(columns={
        "Platform": "PlatformName"
    })

    df = df.drop_duplicates(subset=["PlatformName"])

    try:

        existing = pd.read_sql(
            """
            SELECT PlatformName
            FROM DimPlatform
            """,
            dw_engine
        )

        df = df[
            ~df["PlatformName"].isin(
                existing["PlatformName"]
            )
        ]

    except Exception:
        pass

    if df.empty:
        print("✅ No new platforms.")
        return

    df.to_sql(
        "DimPlatform",
        dw_engine,
        if_exists="append",
        index=False
    )

    print(f"✅ {len(df)} Platforms Loaded")