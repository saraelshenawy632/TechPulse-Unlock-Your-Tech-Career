from collectors.workday_collector import WorkdayCollector
from collectors.greenhouse_collector import GreenhouseCollector
from collectors.lever_collector import LeverCollector
from collectors.smartrecruiters_collector import SmartRecruitersCollector
from collectors.custom_collector import CustomCollector
from collectors.taleo_collector import TaleoCollector



class CollectorFactory:



    @staticmethod
    def create(platform):


        platform = platform.lower()



        if platform == "workday":

            return WorkdayCollector()



        elif platform == "greenhouse":

            return GreenhouseCollector()



        elif platform == "lever":

            return LeverCollector()



        elif platform == "smartrecruiters":

            return SmartRecruitersCollector()



        elif platform == "custom":

            return CustomCollector()



        elif platform == "taleo":

            return TaleoCollector()



        else:

            raise Exception(
                f"Unsupported Platform {platform}"
            )



    @staticmethod
    def get_collector(platform):

        return CollectorFactory.create(platform)