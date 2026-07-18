import pandas as pd
import unicodedata

from sqlalchemy import text

from database.db import engine
from warehouse.db import dw_engine


print("🔥 FACT LOADER IMPORTED")



def normalize_location(value):

    if pd.isna(value):
        return ""

    value = str(value).strip()

    value = unicodedata.normalize(
        "NFKD",
        value
    )

    value = "".join(
        c for c in value
        if not unicodedata.combining(c)
    )

    return (
        value
        .casefold()
        .replace(" ", "")
        .replace(",", "")
    )



def detect_work_type(title, location):

    text = (
        str(title)
        +
        " "
        +
        str(location)
    ).lower()


    if any(
        x in text
        for x in [
            "remote",
            "wfh",
            "work from home"
        ]
    ):
        return "Remote"


    if any(
        x in text
        for x in [
            "hybrid",
            "flexible"
        ]
    ):
        return "Hybrid"


    return "On-site"




def detect_experience(title):

    title = str(title).lower()


    if "intern" in title:
        return "Intern"

    if "junior" in title or "jr" in title:
        return "Junior"

    if "senior" in title or "sr" in title:
        return "Senior"

    if "lead" in title:
        return "Lead"

    if "manager" in title:
        return "Manager"


    return "Mid"




def detect_category(title):

    title = str(title).lower()


    categories = {

        "Frontend":
        [
            "frontend",
            "react",
            "angular",
            "vue"
        ],

        "Backend":
        [
            "backend",
            "node",
            "java",
            ".net"
        ],

        "Data Analytics":
        [
            "data analyst",
            "bi"
        ],

        "Data Engineering":
        [
            "data engineer",
            "etl"
        ],

        "AI / Data Science":
        [
            "ai",
            "machine learning",
            "data scientist"
        ],

        "Sales":
        [
            "sales",
            "account executive"
        ],

        "DevOps":
        [
            "devops",
            "cloud"
        ]

    }


    for key, words in categories.items():

        for word in words:

            if word in title:
                return key


    return "Other"





def load_fact_jobs():

    print("🚀 Loading Fact Jobs...")



    # ==========================
    # Clean Jobs
    # ==========================

    jobs = pd.read_sql(
        """
        SELECT *
        FROM CleanJobs
        """,
        engine
    )


    print(
        f"📦 Clean Jobs Found : {len(jobs)}"
    )


    if jobs.empty:
        return


    # ==========================
    # Remove Duplicate Jobs
    # ==========================
    before_duplicates = len(jobs)
    
    jobs["JobCode"] = (
        jobs["JobCode"]
        .fillna("")
        .astype(str)
        .str.strip()
    )
    
    jobs = (
        jobs
        .drop_duplicates(
            subset=[
                "SourceID",
                "JobCode"
            ],
            keep="first"
        )
    )
    
    after_duplicates = len(jobs)
    
    print(
        f"🧹 Removed Duplicates : {before_duplicates - after_duplicates}"
    )
    print(
        f"📦 Jobs After Cleaning : {after_duplicates}"
    )


    # ==========================
    # Add Company + Platform
    # ==========================

    company_sources = pd.read_sql(
        """
        SELECT
            SourceID,
            CompanyName,
            Platform
        FROM CompanySources
        """,
        engine
    )



    jobs = jobs.merge(
        company_sources,
        on="SourceID",
        how="left"
    )




    # ==========================
    # Company Dimension
    # ==========================


    companies = pd.read_sql(
        """
        SELECT
            CompanyKey,
            CompanyName
        FROM DimCompany
        """,
        dw_engine
    )



    jobs["CompanyName"] = (
        jobs["CompanyName"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )


    companies["CompanyName"] = (
        companies["CompanyName"]
        .astype(str)
        .str.strip()
    )



    jobs = jobs.merge(
        companies,
        on="CompanyName",
        how="left"
    )



    jobs["CompanyKey"] = (
        jobs["CompanyKey"]
        .fillna(
            companies.iloc[0]["CompanyKey"]
        )
    )





    # ==========================
    # Location Dimension
    # ==========================


    locations = pd.read_sql(
        """
        SELECT
        LocationKey,
        FullLocation
        FROM DimLocation
        """,
        dw_engine
    )



    jobs["Location"] = (
        jobs["Location"]
        .fillna("Not Specified")
    )



    jobs["Location_Normalized"] = (
        jobs["Location"]
        .apply(normalize_location)
    )


    locations["Location_Normalized"] = (
        locations["FullLocation"]
        .apply(normalize_location)
    )



    jobs = jobs.merge(
        locations[
            [
                "LocationKey",
                "Location_Normalized"
            ]
        ],
        on="Location_Normalized",
        how="left"
    )



    jobs["LocationKey"] = (
        jobs["LocationKey"]
        .fillna(
            locations.iloc[0]["LocationKey"]
        )
    )





    # ==========================
    # Dates
    # ==========================


    dates = pd.read_sql(
        """
        SELECT
        DateKey,
        FullDate
        FROM DimDate
        """,
        dw_engine
    )



    jobs["PostedDate"] = pd.to_datetime(
        jobs["PostedDate"],
        errors="coerce"
    )



    jobs["PostedDate"] = (
        jobs["PostedDate"]
        .fillna(
            pd.Timestamp.today()
        )
        .dt.date
    )



    dates["FullDate"] = pd.to_datetime(
        dates["FullDate"]
    ).dt.date



    jobs = jobs.merge(
        dates,
        left_on="PostedDate",
        right_on="FullDate",
        how="left"
    )



    jobs["DateKey"] = (
        jobs["DateKey"]
        .fillna(
            dates.iloc[0]["DateKey"]
        )
    )






    # ==========================
    # Platform Dimension
    # ==========================


    platforms = pd.read_sql(
        """
        SELECT
        PlatformKey,
        PlatformName
        FROM DimPlatform
        """,
        dw_engine
    )



    jobs["Platform"] = (
        jobs["Platform"]
        .fillna("Unknown")
        .astype(str)
    )



    jobs = jobs.merge(
        platforms,
        left_on="Platform",
        right_on="PlatformName",
        how="left"
    )



    jobs["PlatformKey"] = (
        jobs["PlatformKey"]
        .fillna(
            platforms.iloc[0]["PlatformKey"]
        )
    )






    # ==========================
    # Analytics
    # ==========================


    jobs["WorkType"] = jobs.apply(
        lambda x:
        detect_work_type(
            x["Title"],
            x["Location"]
        ),
        axis=1
    )



    jobs["ExperienceLevel"] = (
        jobs["Title"]
        .apply(detect_experience)
    )



    jobs["JobCategory"] = (
        jobs["Title"]
        .apply(detect_category)
    )






    # ==========================
    # Final Fact
    # ==========================


    fact = pd.DataFrame()


    fact["CompanyKey"] = jobs["CompanyKey"].astype(int)

    fact["LocationKey"] = jobs["LocationKey"].astype(int)

    fact["DateKey"] = jobs["DateKey"].astype(int)

    fact["PlatformKey"] = jobs["PlatformKey"].astype(int)

    fact["JobCode"] = jobs["JobCode"].astype(str)

    fact["Title"] = jobs["Title"]

    fact["Posted"] = jobs["PostedDate"].astype(str)

    fact["WorkType"] = jobs["WorkType"]

    fact["ExperienceLevel"] = jobs["ExperienceLevel"]

    fact["JobCategory"] = jobs["JobCategory"]



    print(
        f"📊 Final Fact Rows : {len(fact)}"
    )



    with dw_engine.begin() as conn:

        print("🧹 Clearing FactJobs...")

        conn.execute(
            text(
                "DELETE FROM FactJobs"
            )
        )



    print(
        "🚀 Loading FactJobs..."
    )



    fact.to_sql(
        "FactJobs",
        dw_engine,
        if_exists="append",
        index=False
    )



    print(
        f"✅ {len(fact)} Jobs Loaded Into FactJobs"
    )