import requests



class BaseCollector:



    def __init__(self):

        self.session = requests.Session()



    def build_api_url(self, company):

        raise NotImplementedError



    def get(
        self,
        url,
        params=None,
        headers=None
    ):


        response = self.session.get(

            url,

            params=params,

            headers=headers,

            timeout=30

        )


        response.raise_for_status()


        return response




    def post(
        self,
        url,
        payload=None,
        headers=None
    ):


        response = self.session.post(

            url,

            json=payload,

            headers=headers,

            timeout=30

        )


        response.raise_for_status()


        return response