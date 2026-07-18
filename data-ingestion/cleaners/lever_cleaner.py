from cleaners.common_cleaner import (
    normalize_country,
    extract_city,
    detect_work_type,
    detect_experience
)




class LeverCleaner:



    def clean(self, job):


        if not isinstance(job, dict):

            return None



        title = job.get("text")



        if not title:

            return None



        categories = job.get(
            "categories",
            {}
        )



        location = categories.get(
            "location",
            ""
        )



        description = job.get(
            "descriptionPlain",
            ""
        )



        full_text = (

            str(title)
            +
            str(description)
            +
            str(location)

        )



        return {


            "Title":

                title,



            "JobCode":

                job.get("id"),



            "JobURL":

                job.get("hostedUrl"),



            "City":

                extract_city(location),



            "Country":

                normalize_country(location),



            "Location":

                location,



            "Posted":

                job.get("createdAt"),



            "WorkType":

                detect_work_type(full_text),



            "ExperienceLevel":

                detect_experience(title),



            "JobCategory":

                categories.get(
                    "team",
                    "Technology"
                )

        }