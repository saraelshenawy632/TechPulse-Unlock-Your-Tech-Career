from warehouse.db import dw_engine
from sqlalchemy import text
from datetime import datetime



def save_log(
        company,
        platform,
        status,
        job_count,
        error=None
):


    query = text("""

    INSERT INTO ETL_Log

    (
        Company,
        Platform,
        Status,
        JobCount,
        ErrorMessage,
        RunDate
    )


    VALUES

    (
        :company,
        :platform,
        :status,
        :job_count,
        :error,
        :date
    )

    """)



    with dw_engine.begin() as conn:


        conn.execute(

            query,

            {

            "company": company,

            "platform": platform,

            "status": status,

            "job_count": job_count,

            "error": error,

            "date": datetime.now()

            }

        )