from collectors.base_collector import BaseCollector


from repositories.raw_job_repository import save_raw_jobs
from repositories.clean_job_repository import save_clean_jobs


from cleaners.smartrecruiters_cleaner import SmartRecruitersCleaner





class SmartRecruitersCollector(BaseCollector):



    def build_api_url(self, company):


        company_id = (
            company.CareerURL
            .rstrip("/")
            .split("/")[-1]
        )


        return (
            "https://api.smartrecruiters.com/"
            f"v1/companies/{company_id}/postings"
        )




    def collect(self, company):


        print("\n" + "="*70)

        print(
            f"🔵 Collecting SmartRecruiters jobs from {company.CompanyName}"
        )

        print("="*70)



        url = self.build_api_url(company)



        print(
            "API URL:",
            url
        )



        try:


            response = self.get(url)


            data = response.json()


        except Exception as e:


            print(
                "❌ SmartRecruiters Error:",
                e
            )


            return {
                "jobs_collected":0,
                "jobs_inserted":0
            }



        jobs = data.get(
            "content",
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




        for job in jobs:


            location = job.get(
                "location",
                {}
            )



            job["Title"] = job.get(
                "name"
            )


            job["JobCode"] = job.get(
                "refNumber"
            )


            job["JobURL"] = job.get(
                "ref"
            )


            job["Location"] = location.get(
                "fullLocation"
            )


            job["City"] = location.get(
                "city"
            )


            job["Country"] = location.get(
                "country"
            )


            job["Company"] = company.CompanyName


            job["Platform"] = "SmartRecruiters"


            job["Posted"] = job.get(
                "releasedDate"
            )


            job["WorkType"] = None

            job["ExperienceLevel"] = None

            job["JobCategory"] = None




        print("🚀 Saving Raw Jobs...")



        save_raw_jobs(

            company.SourceID,

            jobs

        )



        cleaner = SmartRecruitersCleaner()



        df = cleaner.clean(jobs)



        clean_jobs = df.to_dict(
            "records"
        )



        inserted = save_clean_jobs(

            company.SourceID,

            clean_jobs

        )



        return {


            "jobs_collected":len(jobs),

            "jobs_inserted":inserted

        }