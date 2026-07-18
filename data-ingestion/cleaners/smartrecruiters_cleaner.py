import pandas as pd


class SmartRecruitersCleaner:

    def categorize_job(self, title):

        if not title:
            return "Other"

        title = title.lower()

        if any(x in title for x in [
            "software",
            "developer",
            "engineer",
            "backend",
            "frontend",
            "full stack",
            "devops",
            "cloud",
            "data",
            "machine learning",
            "ai",
            "security"
        ]):
            return "Technology"

        if any(x in title for x in [
            "sales",
            "account executive",
            "business development",
            "customer success",
            "commercial"
        ]):
            return "Sales"

        if any(x in title for x in [
            "finance",
            "financial",
            "accounting",
            "audit",
            "tax"
        ]):
            return "Finance"

        if any(x in title for x in [
            "marketing",
            "brand",
            "seo",
            "content",
            "communications"
        ]):
            return "Marketing"

        if any(x in title for x in [
            "hr",
            "human resources",
            "talent",
            "recruiter",
            "people"
        ]):
            return "HR"

        if any(x in title for x in [
            "operations",
            "operation",
            "manufacturing",
            "production",
            "logistics",
            "supply chain",
            "procurement"
        ]):
            return "Operations"

        return "Other"

    def experience_level(self, title):

        if not title:
            return "Unknown"

        title = title.lower()

        if any(x in title for x in [
            "intern",
            "internship",
            "student",
            "trainee"
        ]):
            return "Intern"

        if any(x in title for x in [
            "junior",
            "entry",
            "graduate",
            "associate"
        ]):
            return "Junior"

        if any(x in title for x in [
            "senior",
            "sr.",
            "sr "
        ]):
            return "Senior"

        if any(x in title for x in [
            "lead",
            "manager",
            "director",
            "head",
            "principal"
        ]):
            return "Lead"

        return "Mid"

    def work_type(self, job):

        text = str(job).lower()

        if "remote" in text:
            return "Remote"

        if "hybrid" in text:
            return "Hybrid"

        return "On-site"

    def clean(self, jobs):

        rows = []

        for job in jobs:

            title = job.get("name")

            location = (
                job.get("location", {})
                .get("city")
            )

            rows.append({

                "Title": title,

                "Location": location,

                "JobURL": job.get("ref"),

                "JobCode": str(job.get("id")),

                "Posted": job.get("releasedDate"),

                "WorkType":
                    self.work_type(job),

                "ExperienceLevel":
                    self.experience_level(title),

                "JobCategory":
                    self.categorize_job(title)

            })

        return pd.DataFrame(rows)