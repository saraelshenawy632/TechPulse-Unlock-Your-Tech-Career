from repositories.company_repository import get_active_sources

from factories.collector_factory import CollectorFactory

from datetime import datetime




class IngestionService:



    def run(self):


        start = datetime.now()



        print("=" * 70)

        print(
            "🚀 Starting TechPulse Egypt Ingestion Pipeline"
        )

        print("=" * 70)




        companies = get_active_sources()



        print(
            f"🏢 Companies Found : {len(companies)}"
        )



        success = 0

        failed = 0

        total_jobs = 0





        for _, company in companies.iterrows():



            try:



                print("\n" + "-" * 70)

                print(
                    f"🏢 Processing : {company.CompanyName}"
                )

                print(
                    f"🔌 Platform : {company.Platform}"
                )

                print("-" * 70)



                collector = CollectorFactory.get_collector(
                    company.Platform
                )



                result = collector.collect(company)



                total_jobs += (
                    result.get(
                        "jobs_inserted",
                        0
                    )
                    or
                    0
                )



                success += 1



            except Exception as e:


                failed += 1



                print(
                    f"❌ Error {company.CompanyName}: {e}"
                )





        duration = datetime.now()-start



        print("\n" + "=" * 70)

        print(
            "🎯 INGESTION FINISHED"
        )

        print("=" * 70)



        print(
            f"✅ Successful Companies : {success}"
        )


        print(
            f"❌ Failed Companies : {failed}"
        )


        print(
            f"📦 Total Jobs Loaded : {total_jobs}"
        )


        print(
            f"⏱ Duration : {duration}"
        )


        print("=" * 70)