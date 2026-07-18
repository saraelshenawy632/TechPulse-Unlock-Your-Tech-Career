from bs4 import BeautifulSoup
import pandas as pd


from collectors.base_collector import BaseCollector


from repositories.raw_job_repository import save_raw_jobs
from repositories.clean_job_repository import save_clean_jobs





class CustomCollector(BaseCollector):


    def build_api_url(self, company):

        return company.CareerURL




    def collect(self, company):


        print("\n🌐 Collecting Custom jobs from", company.CompanyName)



        try:

            response = self.get(
                company.CareerURL
            )


        except Exception as e:


            print(
                "❌ Error:",
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



        jobs=[]



        for link in soup.find_all("a"):


            title = link.get_text(
                strip=True
            )


            href = link.get(
                "href"
            )



            if title:


                jobs.append({

                    "Title":title,

                    "JobURL":href,

                    "Company":company.CompanyName,

                    "Platform":"Custom",

                    "Location":None,

                    "City":None,

                    "Country":None,

                    "JobCode":None,

                    "Posted":None,

                    "WorkType":None,

                    "ExperienceLevel":None,

                    "JobCategory":None

                })




        if not jobs:


            print("⚠️ No Jobs Found")


            return {
                "jobs_collected":0,
                "jobs_inserted":0
            }




        save_raw_jobs(

            company.SourceID,

            jobs

        )



        df=pd.DataFrame(
            jobs
        )



        inserted=save_clean_jobs(

            company.SourceID,

            df.to_dict("records")

        )



        return {

            "jobs_collected":len(jobs),

            "jobs_inserted":inserted

        }