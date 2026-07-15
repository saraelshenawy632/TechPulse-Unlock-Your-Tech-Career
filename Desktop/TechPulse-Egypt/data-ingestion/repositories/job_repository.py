from sqlalchemy import text
from database.db import engine


def save_jobs(df):

    with engine.begin() as conn:

        for _, row in df.iterrows():

            conn.execute(

                text("""

                INSERT INTO Jobs
                (

                    Title,
                    JobURL,
                    PostedDate

                )

                VALUES
                (

                    :Title,
                    :JobURL,
                    GETDATE()

                )

                """),

                {

                    "Title": row["Title"],

                    "JobURL": row["JobURL"]

                }

            )

    print(f"✅ {len(df)} Jobs Saved")