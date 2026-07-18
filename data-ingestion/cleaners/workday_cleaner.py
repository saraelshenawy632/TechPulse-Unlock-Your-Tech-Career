import pandas as pd
from datetime import datetime, timedelta


class WorkdayCleaner:

    # =========================
    # Job Category
    # =========================

    def categorize_job(self, title):

        if not title:
            return "Other"

        title = title.lower()

        if any(word in title for word in [
            "account executive",
            "account manager",
            "sales",
            "business development",
            "customer success",
            "commercial"
        ]):
            return "Sales"

        if any(word in title for word in [
            "software",
            "developer",
            "engineer",
            "engineering",
            "data",
            "machine learning",
            "ai",
            "backend",
            "frontend",
            "full stack",
            "cloud",
            "devops",
            "security"
        ]):
            return "Technology"

        if any(word in title for word in [
            "marketing",
            "brand",
            "content",
            "seo"
        ]):
            return "Marketing"

        if any(word in title for word in [
            "finance",
            "accounting",
            "financial",
            "audit",
            "tax"
        ]):
            return "Finance"

        if any(word in title for word in [
            "hr",
            "human resources",
            "talent",
            "recruit"
        ]):
            return "HR"

        if any(word in title for word in [
            "operation",
            "logistics",
            "procurement",
            "supply chain"
        ]):
            return "Operations"

        return "Other"

    # =========================
    # Experience Level
    # =========================

    def experience_level(self, title):

        if not title:
            return "Unknown"

        title = title.lower()

        if any(word in title for word in [
            "intern",
            "internship",
            "student",
            "graduate",
            "trainee"
        ]):
            return "Intern"

        if any(word in title for word in [
            "junior",
            "entry",
            "associate"
        ]):
            return "Junior"

        if any(word in title for word in [
            "senior",
            "sr."
        ]):
            return "Senior"

        if any(word in title for word in [
            "lead",
            "manager",
            "director",
            "head",
            "principal"
        ]):
            return "Lead"

        return "Mid"

    # =========================
    # Work Type
    # =========================

    def work_type(self, job):

        text = str(job).lower()

        if "remote" in text:
            return "Remote"

        if "hybrid" in text:
            return "Hybrid"

        return "On-site"

    # =========================
    # Convert Posted Text
    # =========================

    def parse_posted(self, value):

        if not value:
            return None

        value = str(value).strip().lower()

        today = datetime.today().date()

        if value == "posted today":
            return today.isoformat()

        if value == "today":
            return today.isoformat()

        if value == "posted yesterday":
            return (today - timedelta(days=1)).isoformat()

        if value == "yesterday":
            return (today - timedelta(days=1)).isoformat()

        if "days ago" in value:

            try:

                days = int(value.split()[1])

                return (
                    today - timedelta(days=days)
                ).isoformat()

            except:

                return None

        # لو القيمة أصلاً تاريخ
        return value

    # =========================
    # Cleaning
    # =========================

    def clean(self, jobs):

        rows = []

        for job in jobs:

            title = job.get("title")
            location = job.get("locationsText")

            if not title or not location:
                continue

            posted = self.parse_posted(
                job.get("postedOn")
            )

            rows.append({

                "Title": title,

                "Location": location,

                "JobURL":
                    "https://valeo.wd3.myworkdayjobs.com/valeo_jobs"
                    + job.get("externalPath", ""),

                "JobCode":
                    job.get("bulletFields", [""])[0]
                    if job.get("bulletFields")
                    else "",

                "Posted": posted,

                "WorkType":
                    self.work_type(job),

                "ExperienceLevel":
                    self.experience_level(title),

                "JobCategory":
                    self.categorize_job(title)

            })

        df = pd.DataFrame(rows)

        df = df.fillna("")
        df = df.replace({pd.NA: "", None: ""})

        return df