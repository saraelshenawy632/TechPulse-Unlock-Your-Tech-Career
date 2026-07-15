import os
import urllib.parse

from dotenv import load_dotenv
from sqlalchemy import create_engine


load_dotenv()


SERVER = os.getenv("SERVER")
DATABASE = os.getenv("DW_DATABASE")
DRIVER = os.getenv("DRIVER")


connection_string = (
    f"DRIVER={{{DRIVER}}};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)


params = urllib.parse.quote_plus(connection_string)


dw_engine = create_engine(
    f"mssql+pyodbc:///?odbc_connect={params}",
    fast_executemany=True
)


print(
    f"✅ DW CONNECTED : {DATABASE}"
)