import pandas as pd

from warehouse.db import dw_engine


def load_dates():

    start_date = pd.Timestamp("2025-01-01")
    end_date = pd.Timestamp("2028-12-31")

    dates = pd.date_range(start_date, end_date)

    df = pd.DataFrame()

    df["FullDate"] = dates

    df["DateKey"] = (
        df["FullDate"]
        .dt.strftime("%Y%m%d")
        .astype(int)
    )

    df["DayNumber"] = df["FullDate"].dt.day
    df["MonthNumber"] = df["FullDate"].dt.month
    df["MonthName"] = df["FullDate"].dt.month_name()
    df["QuarterNumber"] = df["FullDate"].dt.quarter
    df["YearNumber"] = df["FullDate"].dt.year
    df["WeekDayName"] = df["FullDate"].dt.day_name()

    df["FullDate"] = df["FullDate"].dt.date

    try:
        existing = pd.read_sql(
            "SELECT DateKey FROM DimDate",
            dw_engine
        )

        df = df[
            ~df["DateKey"].isin(existing["DateKey"])
        ]

    except:
        pass

    if df.empty:
        print("✅ No new dates.")
        return

    df.to_sql(
        "DimDate",
        dw_engine,
        if_exists="append",
        index=False
    )

    print(f"✅ {len(df)} Dates Loaded")