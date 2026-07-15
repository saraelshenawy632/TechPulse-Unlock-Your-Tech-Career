import re
import pycountry



def normalize_country(location):


    if not location:

        return None



    try:

        parts = location.split(",")


        country = parts[-1].strip()



        result = pycountry.countries.search_fuzzy(country)



        return result[0].name



    except Exception:


        return country





def extract_city(location):


    if not location:

        return None



    parts = location.split(",")



    return parts[0].strip()





def detect_work_type(text):


    if not text:

        return "Unknown"



    text = text.lower()



    if "remote" in text:

        return "Remote"



    if "hybrid" in text:

        return "Hybrid"



    if "work from home" in text:

        return "Remote"



    return "On-site"





def detect_experience(title):


    if not title:

        return "Unknown"



    title = title.lower()



    if "intern" in title:

        return "Intern"



    if "junior" in title or "jr" in title:

        return "Junior"



    if "senior" in title or "sr" in title:

        return "Senior"



    if "lead" in title:

        return "Lead"



    if "manager" in title:

        return "Manager"



    return "Mid"