from cleaners.common_cleaner import (
    normalize_country,
    extract_city,
    detect_work_type,
    detect_experience
)



class GreenhouseCleaner:



    def clean(self, job):


        if not isinstance(job, dict):

            return None



        title = job.get("title")


        if not title:

            return None



        location = job.get("location")



        if isinstance(location, dict):

            location = location.get("name")



        if not location:

            location = ""



        description = job.get(
            "content",
            ""
        )



        text = (
            str(title)
            + " "
            + str(location)
            + " "
            + str(description)
        )



        return {


            "Title":
                title,


            "JobCode":
                job.get("id"),



            "JobURL":
                job.get("absolute_url"),



            "City":
                extract_city(location),



            "Country":
                normalize_country(location),



            "Location":
                location,



            "Posted":
                job.get("updated_at"),



            "WorkType":
                detect_work_type(text),



            "ExperienceLevel":
                detect_experience(title),



            "JobCategory":
                "Technology"

        }