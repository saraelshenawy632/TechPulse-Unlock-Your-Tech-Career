from database.db import engine
from warehouse.db import dw_engine

import pandas as pd


print("SOURCE")

print(
    pd.read_sql(
        "SELECT COUNT(*) as Total FROM RawJobs",
        engine
    )
)


print("WAREHOUSE")


print(
    pd.read_sql(
        "SELECT COUNT(*) as Total FROM FactJobs",
        dw_engine
    )
)