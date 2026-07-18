from warehouse.db import dw_engine
from sqlalchemy import text


def save_clean_jobs(source_id, jobs):

    if not jobs:

        print("❌ No Clean Jobs")

        return 0

    inserted = 0
    skipped = 0

    with dw_engine.begin() as conn:

        check_query = text("""
            SELECT 1
            FROM CleanJobs
            WHERE SourceID = :SourceID
              AND JobCode = :JobCode
        """)

        insert_query = text("""

            INSERT INTO CleanJobs
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

        for job in jobs:

            job_code = str(job.get("JobCode", "")).strip()

            if job_code == "":
                skipped += 1
                continue

            exists = conn.execute(
                check_query,
                {
                    "SourceID": source_id,
                    "JobCode": job_code
                }
            ).fetchone()

            if exists:
                skipped += 1
                continue

            conn.execute(
                insert_query,
                {
                    "SourceID": source_id,
                    "Title": job.get("Title"),
                    "JobCode": job_code,
                    "JobURL": job.get("JobURL"),
                    "City": job.get("City"),
                    "Country": job.get("Country"),
                    "Location": job.get("Location"),
                    "Posted": job.get("Posted"),
                    "WorkType": job.get("WorkType"),
                    "ExperienceLevel": job.get("ExperienceLevel"),
                    "JobCategory": job.get("JobCategory"),
                    "Company": job.get("Company"),
                    "Platform": job.get("Platform")
                }
            )

            inserted += 1

    print(f"✅ Clean Inserted : {inserted}")

    if skipped:
        print(f"⏭️ Duplicates Skipped : {skipped}")

    return inserted