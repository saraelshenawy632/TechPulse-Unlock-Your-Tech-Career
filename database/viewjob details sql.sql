CREATE OR ALTER VIEW vw_JobDetailsFixed
AS
SELECT
    f.JobKey,
    f.CompanyKey,
    c.CompanyName,
    c.Platform,
    c.Industry,

    f.LocationKey,

    CASE
        WHEN l.City IN ('2 Locations','3 Locations')
        THEN
            REPLACE(
                SUBSTRING(
                    f.JobCode,
                    6,
                    CHARINDEX('/',f.JobCode,6)-6
                ),
                '-',
                ' '
            )
        ELSE l.City
    END AS City,

    CASE
        WHEN l.City IN ('2 Locations','3 Locations')
        THEN 'Unknown'
        ELSE l.Country
    END AS Country,

    l.FullLocation,

    f.DateKey,
    d.FullDate,
    d.YearNumber,
    d.MonthNumber,
    d.MonthName,
    d.QuarterNumber,
    d.WeekDayName,

    f.PlatformKey,
    p.PlatformName,

    f.JobCode,
    f.Title,
    f.Posted,
    f.WorkType,
    f.ExperienceLevel,
    f.JobCategory

FROM FactJobs f
LEFT JOIN DimCompany c
ON f.CompanyKey=c.CompanyKey

LEFT JOIN DimLocation l
ON f.LocationKey=l.LocationKey

LEFT JOIN DimDate d
ON f.DateKey=d.DateKey

LEFT JOIN DimPlatform p
ON f.PlatformKey=p.PlatformKey;