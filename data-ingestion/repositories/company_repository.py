import pandas as pd
from database.db import engine


def get_active_sources():

    query = """

        SELECT

            SourceID,

            CompanyName,

            CareerURL,

            Platform,

            IsActive


        FROM CompanySources


        WHERE IsActive = 1

    """


    return pd.read_sql(
        query,
        engine
    )