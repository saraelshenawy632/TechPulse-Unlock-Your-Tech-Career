from collectors.base_collector import BaseCollector

from repositories.raw_job_repository import save_raw_jobs
from repositories.clean_job_repository import save_clean_jobs

from cleaners.workday_cleaner import WorkdayCleaner

import json


class WorkdayCollector(BaseCollector):

    def build_api_url(self, company):

        return company.CareerURL

    def collect(self, company):

        print("\n" + "=" * 70)
        print(f"🟠 Collecting Workday jobs from {company.CompanyName}")
        print("=" * 70)

        url = company.CareerURL

        print(f"🌐 URL : {url}")

        try:

            response = self.get(url)

            print(f"\n✅ Status Code : {response.status_code}")
            print(f"✅ Content-Type : {response.headers.get('Content-Type')}")

            print("\n================ RESPONSE =================\n")

            print(response.text[:2000])

            print("\n==========================================\n")

            response.raise_for_status()

            try:

                data = response.json()

            except Exception as e:

                print("❌ Response is NOT JSON")
                print(e)

                return {
                    "jobs_collected": 0,
                    "jobs_inserted": 0
                }

        except Exception as e:

            print("❌ Workday Request Error")
            print(e)

            return {
                "jobs_collected": 0,
                "jobs_inserted": 0
            }

        jobs = data.get(
            "jobPostings",
            []
        )

        if not jobs:

            print("⚠️ No Jobs Found")

            print("\n============== JSON ==================\n")

            print(
                json.dumps(
                    data,
                    indent=4,
                    ensure_ascii=False
                )[:3000]
            )

            print("\n======================================\n")

            return {
                "jobs_collected": 0,
                "jobs_inserted": 0
            }

        print(f"✅ Total Jobs Collected : {len(jobs)}")

        print("\n============== FIRST JOB ==============\n")

        print(
            json.dumps(
                jobs[0],
                indent=4,
                ensure_ascii=False
            )
        )

        print("\n=======================================\n")

        for job in jobs:

            job["Title"] = job.get("title")

            job["JobCode"] = (
                job.get("jobId")
                or job.get("bulletFields", [""])[0]
                if job.get("bulletFields")
                else ""
            )

            job["JobURL"] = (
                "https://valeo.wd3.myworkdayjobs.com"
                + job.get("externalPath", "")
            )

            job["Location"] = job.get("locationsText")

            job["City"] = None

            job["Country"] = None

            job["Posted"] = (
                job.get("postedOn")
                or job.get("postedDate")
                or job.get("postedOnDate")
                or job.get("datePosted")
                or ""
            )

            job["WorkType"] = None

            job["ExperienceLevel"] = None

            job["JobCategory"] = None

            job["Company"] = company.CompanyName

            job["Platform"] = "Workday"

        save_raw_jobs(
            company.SourceID,
            jobs
        )

        cleaner = WorkdayCleaner()

        df = cleaner.clean(jobs)

        clean_jobs = df.to_dict("records")

        inserted = save_clean_jobs(
            company.SourceID,
            clean_jobs
        )

        return {

            "jobs_collected": len(jobs),

            "jobs_inserted": inserted

        }