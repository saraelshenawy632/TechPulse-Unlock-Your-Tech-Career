from collectors.base_collector import BaseCollector

from repositories.raw_job_repository import save_raw_jobs
from repositories.clean_job_repository import save_clean_jobs

from cleaners.greenhouse_cleaner import GreenhouseCleaner



class GreenhouseCollector(BaseCollector):


    def collect(self, company):

        print("\n" + "=" * 70)
        print(f"🟢 Collecting Greenhouse Jobs From {company.CompanyName}")
        print("=" * 70)


        if not company.CareerURL:

            print("❌ CareerURL Missing")

            return {
                "jobs_collected":0,
                "jobs_inserted":0
            }



        board = company.CareerURL.rstrip("/").split("/")[-1]


        url = f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs"



        print(url)



        response = self.get(url)



        data = response.json()


        jobs = data.get(
            "jobs",
            []
        )



        if not jobs:

            print("⚠️ No Jobs Found")

            return {
                "jobs_collected":0,
                "jobs_inserted":0
            }



        print(
            f"✅ Total Jobs Collected : {len(jobs)}"
        )



        # =========================
        # Save Raw
        # =========================


        save_raw_jobs(
            company.SourceID,
            jobs
        )



        # =========================
        # Clean
        # =========================


        print("🧹 Cleaning Jobs...")


        cleaner = GreenhouseCleaner()



        clean_jobs = []



        for job in jobs:


            cleaned = cleaner.clean(job)



            if cleaned:

                clean_jobs.append(cleaned)



        print(
            f"✅ Clean Jobs : {len(clean_jobs)}"
        )



        inserted = save_clean_jobs(

            company.SourceID,

            clean_jobs

        )



        print(
            f"✅ Clean Inserted : {inserted}"
        )



        return {

            "jobs_collected":len(jobs),

            "jobs_inserted":inserted

        }