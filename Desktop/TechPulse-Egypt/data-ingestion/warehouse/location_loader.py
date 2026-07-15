import re
import pandas as pd
import unicodedata
from geopy.geocoders import Nominatim
from database.db import engine
from warehouse.db import dw_engine

# إعداد Geolocator مع تحديد user_agent مناسب للخدمة
geolocator = Nominatim(user_agent="techpulse")

# قاموس لتحديد الدولة بناءً على المدينة لتسريع المعالجة وتفادي قيود الـ API
CITY_COUNTRY = {
    "Austin": "United States",
    "Bengaluru": "India",
    "Hatvan": "Hungary",
    "Cikarang": "Indonesia",
    "Chennai": "India",
    "Berlin": "Germany",
    "Paris": "France",
    "Cairo": "Egypt",
    # يمكنك إضافة المزيد من المدن الشائعة هنا لتسريع العملية
}


def normalize_location(text):

    if pd.isna(text):
        return ""

    text = str(text).strip()

    text = unicodedata.normalize(
        "NFKD",
        text
    )

    text = "".join(
        c for c in text
        if not unicodedata.combining(c)
    )

    return (
        text
        .casefold()
        .replace("?", "")
        .replace(" ", "")
        .replace(",", "")
    )


def detect_country(city):
    try:
        # البحث عن إحداثيات المدينة باللغة الإنجليزية
        location = geolocator.geocode(city, language="en", timeout=5)

        if location:
            # استخدام الإحداثيات لجلب بيانات العنوان بالكامل لتحديد الدولة بدقة
            address = geolocator.reverse(
                (location.latitude, location.longitude),
                language="en"
            )

            if address:
                return address.raw["address"].get("country", "Unknown")

    except:
        pass

    return "Unknown"


def load_locations():

    print("🚀 Loading Locations...")


    # =====================================================
    # Read Locations From CleanJobs
    # =====================================================

    query = """

        SELECT DISTINCT
            Location,
            Country

        FROM CleanJobs

        WHERE Location IS NOT NULL
        AND LTRIM(RTRIM(Location)) <> ''

    """


    source_df = pd.read_sql(
        query,
        engine
    )


    source_df.rename(
        columns={
            "Location":"FullLocation"
        },
        inplace=True
    )

    # تنظيف عمود الدولة القادم من قاعدة البيانات وتعبئة القيم الفارغة بـ Unknown
    source_df["Country"] = (
        source_df["Country"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )


    source_df["FullLocation"] = (

        source_df["FullLocation"]
        .astype(str)
        .str.strip()
        .str.replace(
            r"\s+",
            " ",
            regex=True
        )

    )


    source_df = source_df[
        source_df["FullLocation"] != ""
    ]



    # =====================================================
    # Analytical Locations
    # =====================================================

    analytics = pd.DataFrame(
        [
            {
                "FullLocation": "Remote",
                "Country": "Remote"
            },
            {
                "FullLocation": "Not Specified",
                "Country": "Not Specified"
            }
        ]
    )



    source_df = pd.concat(
        [
            source_df,
            analytics
        ],
        ignore_index=True
    )



    # =====================================================
    # Normalize
    # =====================================================

    source_df["Location_Normalized"] = (

        source_df["FullLocation"]
        .apply(normalize_location)

    )


    source_df.drop_duplicates(
        subset=[
            "Location_Normalized"
        ],
        inplace=True
    )


    print(
        f"Source Locations (Normalized with Analytics): {len(source_df)}"
    )



    # =====================================================
    # Existing DimLocation
    # =====================================================

    try:


        old_df = pd.read_sql(
            "SELECT FullLocation FROM DimLocation",
            dw_engine
        )


        old_df["Location_Normalized"] = (

            old_df["FullLocation"]
            .astype(str)
            .apply(normalize_location)

        )


    except:


        old_df = pd.DataFrame(
            columns=[
                "FullLocation",
                "Location_Normalized"
            ]
        )



    # =====================================================
    # New Locations Only
    # =====================================================


    new_df = source_df[
        ~source_df["Location_Normalized"]
        .isin(
            old_df["Location_Normalized"]
        )
    ].copy()


    total_new = len(new_df)

    if new_df.empty:

        print(
            "✅ No new locations to insert."
        )

        return



    # =====================================================
    # City / Country Extraction
    # =====================================================

    cities = []
    countries = []
    
    # استخدام enumerate لتتبع رقم السطر الحالي والتقدم الكلي
    for i, location in enumerate(new_df["FullLocation"]):
        # تنظيف الرموز المحددة واستبدالها بفواصل قبل الـ split
        loc_str = str(location)
        loc_str = loc_str.replace("|", ",")
        loc_str = loc_str.replace(";", ",")
        loc_str = loc_str.replace("•", ",")
        
        # استخراج الجزء الأول كمدينة فقط
        city = loc_str.split(",")[0].strip()

        if city == "" or city.lower() == "nan":
            city = "Not Specified"

        # طباعة حالة التقدم الحالية بوضوح
        print(f"⏳ {i+1}/{total_new} : {city} (Original: {location})")

        cities.append(city)

        # التحقق من وجود الدولة في القاموس أولاً لتجنب استهلاك الـ API بشكل مفرط
        country = CITY_COUNTRY.get(city)
        if country is None:
            # إذا لم تكن موجودة، يتم جلبها حياً من Geopy
            country = detect_country(city)
            
        countries.append(country)

    new_df["City"] = cities
    new_df["Country"] = countries


    new_df.drop(

        columns=[
            "Location_Normalized"
        ],

        inplace=True

    )



    # =====================================================
    # Insert Into Warehouse
    # =====================================================


    new_df.to_sql(

        "DimLocation",

        dw_engine,

        if_exists="append",

        index=False

    )



    print(
        f"✅ {len(new_df)} Locations Loaded"
    )