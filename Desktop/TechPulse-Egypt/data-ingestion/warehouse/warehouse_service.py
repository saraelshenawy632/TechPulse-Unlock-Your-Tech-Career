
from warehouse.db import dw_engine

from warehouse.platform_loader import load_platforms
from warehouse.company_loader import load_companies
from warehouse.location_loader import load_locations
from warehouse.date_loader import load_dates
from warehouse.fact_loader import load_fact_jobs
from sqlalchemy import text


class WarehouseService:

    def run(self):

        print("=" * 60)
        print("Loading Data Warehouse")
        print("=" * 60)


        # أثناء التطوير فقط
        with dw_engine.begin() as conn:
            conn.execute(text("TRUNCATE TABLE FactJobs"))

        load_platforms()
        load_companies()
        load_locations()
        load_dates()
        load_fact_jobs()

        print("Done")