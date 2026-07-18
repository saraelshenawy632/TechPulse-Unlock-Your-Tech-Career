from datetime import datetime

from apscheduler.schedulers.blocking import BlockingScheduler

from main import run_ingestion
from warehouse_main import run_warehouse


def run_etl():

    print("\n")
    print("=" * 80)
    print(f"🚀 ETL Started : {datetime.now():%Y-%m-%d %H:%M:%S}")
    print("=" * 80)

    start = datetime.now()

    try:

        print("\n📥 STEP 1 : DATA INGESTION\n")
        run_ingestion()

        print("\n🏗️ STEP 2 : DATA WAREHOUSE\n")
        run_warehouse()

        end = datetime.now()

        print("\n" + "=" * 80)
        print("✅ ETL COMPLETED SUCCESSFULLY")
        print(f"⏱️ Duration : {end - start}")
        print(f"🕒 Finished : {end:%Y-%m-%d %H:%M:%S}")
        print("=" * 80)

    except Exception as e:

        end = datetime.now()

        print("\n" + "=" * 80)
        print("❌ ETL FAILED")
        print(f"Error : {e}")
        print(f"Duration : {end - start}")
        print("=" * 80)


scheduler = BlockingScheduler(timezone="Africa/Cairo")

scheduler.add_job(
    func=run_etl,
    trigger="interval",
    hours=6,
    id="techpulse_etl",
    replace_existing=True,
    max_instances=1,
    coalesce=True,
    next_run_time=datetime.now()
)

print("=" * 80)
print("🟢 TechPulse Scheduler Started")
print("⏰ ETL will run every 6 hours")
print("📌 Press Ctrl + C to stop")
print("=" * 80)

scheduler.start()