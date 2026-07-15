from collectors.base_collector import BaseCollector

from repositories.raw_job_repository import save_raw_jobs
from repositories.clean_job_repository import save_clean_jobs

from cleaners.lever_cleaner import LeverCleaner




class LeverCollector(BaseCollector):



    def collect(self, company):


        print("\n" + "=" * 70)

        print(
            f"🟣 Collecting Lever jobs from {company.CompanyName}"
        )

        print("=" * 70)



        if not company.CareerURL:


            print("❌ CareerURL missing")


            return {

                "jobs_collected":0,

                "jobs_inserted":0

            }




        board = (
            company.CareerURL
            .rstrip("/")
            .split("/")
            [-1]
        )



        url = (
            f"https://api.lever.co/v0/postings/"
            f"{board}?mode=json"
        )



        print("API URL:",url)



        try:


            response = self.get(url)


            jobs = response.json()



        except Exception as e:


            print(
                f"❌ Lever Error: {e}"
            )


            return {

                "jobs_collected":0,

                "jobs_inserted":0

            }




        if not jobs:


            print("⚠️ No Jobs Found")


            return {

                "jobs_collected":0,

                "jobs_inserted":0

            }



        print(
            f"✅ Total Jobs Collected : {len(jobs)}"
        )




        print("\n🚀 Saving Raw Jobs...")



        raw = save_raw_jobs(

            company.SourceID,

            jobs

        )



        print(
            f"✅ Raw Inserted : {raw}"
        )





        print("\n🧹 Cleaning Jobs...")



        cleaner = LeverCleaner()



        clean_jobs = []



        for job in jobs:



            cleaned = cleaner.clean(job)



            if cleaned:


                cleaned["Company"] = company.CompanyName

                cleaned["Platform"] = "Lever"



                clean_jobs.append(cleaned)





        inserted = save_clean_jobs(

            company.SourceID,

            clean_jobs

        )



        print(
            f"✅ Clean Jobs Inserted : {inserted}"
        )




        return {


            "jobs_collected":
                len(clean_jobs),



            "jobs_inserted":
                inserted or 0

        }