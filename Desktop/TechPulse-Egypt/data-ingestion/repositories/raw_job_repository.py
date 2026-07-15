from warehouse.db import dw_engine
from sqlalchemy import text
import pandas as pd



def save_raw_jobs(source_id, jobs):


    if not jobs:

        print("⚠️ No Jobs Found")
        return 0



    df = pd.DataFrame(jobs)



    columns = [

        "Title",
        "JobCode",
        "JobURL",
        "City",
        "Country",
        "Location",
        "Posted",
        "WorkType",
        "ExperienceLevel",
        "JobCategory",
        "Company",
        "Platform"

    ]



    for col in columns:

        if col not in df.columns:

            df[col] = None



    inserted = 0



    query = text("""

    INSERT INTO RawJobs

    (

        SourceID,
        Title,
        JobCode,
        JobURL,
        City,
        Country,
        Location,
        Posted,
        WorkType,
        ExperienceLevel,
        JobCategory,
        Company,
        Platform

    )


    VALUES

    (

        :SourceID,
        :Title,
        :JobCode,
        :JobURL,
        :City,
        :Country,
        :Location,
        :Posted,
        :WorkType,
        :ExperienceLevel,
        :JobCategory,
        :Company,
        :Platform

    )

    """)



    with dw_engine.begin() as conn:


        for _,row in df.iterrows():


            conn.execute(

                query,

                {

                "SourceID":source_id,

                "Title":row["Title"],

                "JobCode":row["JobCode"],

                "JobURL":row["JobURL"],

                "City":row["City"],

                "Country":row["Country"],

                "Location":row["Location"],

                "Posted":row["Posted"],

                "WorkType":row["WorkType"],

                "ExperienceLevel":row["ExperienceLevel"],

                "JobCategory":row["JobCategory"],

                "Company":row["Company"],

                "Platform":row["Platform"]

                }

            )


            inserted +=1



    print(
        f"✅ Raw Inserted : {inserted}"
    )


    return inserted