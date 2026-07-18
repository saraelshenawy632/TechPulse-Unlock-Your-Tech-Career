import re
from bs4 import BeautifulSoup

from collectors.base_collector import BaseCollector

from repositories.raw_job_repository import save_raw_jobs
from repositories.clean_job_repository import save_clean_jobs



class TaleoCollector(BaseCollector):


    def build_api_url(self, company):

        return company.CareerURL



    def collect(self, company):


        print("\n" + "="*70)
        print(
            f"🏦 Collecting Taleo jobs from {company.CompanyName}"
        )
        print("="*70)



        try:

            response = self.get(
                company.CareerURL
            )


        except Exception as e:

            print(
                "❌ Taleo Error:",
                e
            )

            return {
                "jobs_collected":0,
                "jobs_inserted":0
            }



        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )



        text = soup.get_text(
            "\n",
            strip=True
        )



        jobs=[]



        pattern = re.compile(
            r"(.+?)\s+Requisition ID:\s*([A-Za-z0-9_-]+)",
            re.S
        )



        for match in pattern.finditer(text):


            jobs.append({

                "Title":
                    match.group(1).strip(),

                "JobCode":
                    match.group(2).strip(),

                "JobURL":
                    company.CareerURL,

                "Location":
                    None,

                "City":
                    None,

                "Country":
                    None,

                "Posted":
                    None,

                "WorkType":
                    None,

                "ExperienceLevel":
                    None,

                "JobCategory":
                    None,

                "Company":
                    company.CompanyName,

                "Platform":
                    "Taleo"

            })



        if not jobs:

            print("⚠️ No Jobs Found")

            return {
                "jobs_collected":0,
                "jobs_inserted":0
            }



        print(
            f"✅ Jobs Found : {len(jobs)}"
        )



        save_raw_jobs(

            company.SourceID,

            jobs

        )



        inserted = save_clean_jobs(

            company.SourceID,

            jobs

        )



        return {

            "jobs_collected":len(jobs),

            "jobs_inserted":inserted

        }