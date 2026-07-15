from warehouse.warehouse_service import WarehouseService


def run_warehouse():
    print("=" * 70)
    print("STARTING DATA WAREHOUSE")
    print("=" * 70)

    service = WarehouseService()
    service.run()

    print("=" * 70)
    print("DATA WAREHOUSE FINISHED")
    print("=" * 70)


if __name__ == "__main__":
    run_warehouse()