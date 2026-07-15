import pandas as pd

from database.db import engine
from warehouse.db import dw_engine


def load_companies():

    query = """
    SELECT DISTINCT
        CompanyName
    FROM CompanySources
    WHERE CompanyName IS NOT NULL
    """

    companies = pd.read_sql(
        query,
        engine
    )


    if companies.empty:
        print("⚠️ No companies found")
        return


    try:
        existing = pd.read_sql(
            """
            SELECT CompanyName
            FROM DimCompany
            """,
            dw_engine
        )

    except:
        existing = pd.DataFrame(
            columns=["CompanyName"]
        )


    new_companies = companies[
        ~companies["CompanyName"].isin(
            existing["CompanyName"]
        )
    ]


    if new_companies.empty:
        print("✅ No new companies.")
        return



    new_companies["Industry"] = None



    new_companies.to_sql(
        "DimCompany",
        dw_engine,
        if_exists="append",
        index=False
    )


    print(
        f"✅ {len(new_companies)} Companies Loaded"
    )