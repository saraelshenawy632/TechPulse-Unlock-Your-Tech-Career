CREATE TABLE DimCompany (

    CompanyKey INT IDENTITY PRIMARY KEY,

    CompanyName NVARCHAR(200),

    Platform NVARCHAR(100),

    Industry NVARCHAR(100)

);

CREATE TABLE DimLocation (

    LocationKey INT IDENTITY PRIMARY KEY,

    Country NVARCHAR(100),

    City NVARCHAR(100),

    FullLocation NVARCHAR(300)

);
CREATE TABLE DimDate (

    DateKey INT PRIMARY KEY,

    FullDate DATE,

    DayNumber INT,

    MonthNumber INT,

    MonthName NVARCHAR(20),

    QuarterNumber INT,

    YearNumber INT

);
CREATE TABLE DimPlatform (

    PlatformKey INT IDENTITY PRIMARY KEY,

    PlatformName NVARCHAR(100)

);
CREATE TABLE FactJobs (

    JobKey INT IDENTITY PRIMARY KEY,

    CompanyKey INT,

    LocationKey INT,

    DateKey INT,

    PlatformKey INT,

    JobCode NVARCHAR(100),

    Title NVARCHAR(500),

    Posted NVARCHAR(100),

    FOREIGN KEY (CompanyKey) REFERENCES DimCompany(CompanyKey),

    FOREIGN KEY (LocationKey) REFERENCES DimLocation(LocationKey),

    FOREIGN KEY (DateKey) REFERENCES DimDate(DateKey),

    FOREIGN KEY (PlatformKey) REFERENCES DimPlatform(PlatformKey)

);