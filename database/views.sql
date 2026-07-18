/* =========================================
   1. MAIN JOB DETAILS VIEW
========================================= */
CREATE OR ALTER VIEW vw_JobDetails AS
SELECT 
    f.JobKey,
    f.CompanyKey,
    c.CompanyName,
    c.Platform AS CompanyPlatform,
    c.Industry,

    f.LocationKey,
    l.Country,
    l.City,
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
LEFT JOIN DimCompany c ON f.CompanyKey = c.CompanyKey
LEFT JOIN DimLocation l ON f.LocationKey = l.LocationKey
LEFT JOIN DimDate d ON f.DateKey = d.DateKey
LEFT JOIN DimPlatform p ON f.PlatformKey = p.PlatformKey;
GO


/* =========================================
   2. KPI DASHBOARD VIEW (FIXED)
========================================= */
CREATE OR ALTER VIEW vw_DashboardKPIs AS
SELECT 
    COUNT(f.JobKey) AS TotalJobs,
    COUNT(DISTINCT f.CompanyKey) AS ActiveCompanies,
    COUNT(DISTINCT f.JobCode) AS UniqueJobs,

    SUM(CASE WHEN f.WorkType = 'Remote' THEN 1 ELSE 0 END) AS RemoteJobs,
    SUM(CASE WHEN f.WorkType = 'On-site' THEN 1 ELSE 0 END) AS OnsiteJobs
FROM FactJobs f;
GO


/* =========================================
   3. JOBS TREND (NO Year BUG)
========================================= */
CREATE OR ALTER VIEW vw_JobsTrend AS
SELECT 
    d.YearNumber,
    d.MonthNumber,
    d.MonthName,
    COUNT(f.JobKey) AS TotalJobs
FROM FactJobs f
JOIN DimDate d ON f.DateKey = d.DateKey
GROUP BY 
    d.YearNumber,
    d.MonthNumber,
    d.MonthName;
GO


/* =========================================
   4. JOBS BY COMPANY
========================================= */
CREATE OR ALTER VIEW vw_JobsByCompany AS
SELECT 
    c.CompanyName,
    COUNT(f.JobKey) AS TotalJobs
FROM FactJobs f
JOIN DimCompany c ON f.CompanyKey = c.CompanyKey
GROUP BY c.CompanyName;
GO


/* =========================================
   5. JOBS BY PLATFORM
========================================= */
CREATE OR ALTER VIEW vw_JobsByPlatform AS
SELECT 
    p.PlatformName,
    COUNT(f.JobKey) AS TotalJobs
FROM FactJobs f
JOIN DimPlatform p ON f.PlatformKey = p.PlatformKey
GROUP BY p.PlatformName;
GO


/* =========================================
   6. JOBS BY COUNTRY
========================================= */
CREATE OR ALTER VIEW vw_JobsByCountry AS
SELECT 
    l.Country,
    COUNT(f.JobKey) AS TotalJobs
FROM FactJobs f
JOIN DimLocation l ON f.LocationKey = l.LocationKey
GROUP BY l.Country;
GO


/* =========================================
   7. JOBS BY CITY
========================================= */
CREATE OR ALTER VIEW vw_JobsByCity AS
SELECT 
    l.City,
    l.Country,
    COUNT(f.JobKey) AS TotalJobs
FROM FactJobs f
JOIN DimLocation l ON f.LocationKey = l.LocationKey
GROUP BY l.City, l.Country;
GO


/* =========================================
   8. COMPANY × PLATFORM
========================================= */
CREATE OR ALTER VIEW vw_CompanyPlatform AS
SELECT 
    c.CompanyName,
    p.PlatformName,
    COUNT(f.JobKey) AS TotalJobs
FROM FactJobs f
JOIN DimCompany c ON f.CompanyKey = c.CompanyKey
JOIN DimPlatform p ON f.PlatformKey = p.PlatformKey
GROUP BY c.CompanyName, p.PlatformName;
GO


/* =========================================
   9. COMPANY × COUNTRY
========================================= */
CREATE OR ALTER VIEW vw_CompanyCountry AS
SELECT 
    c.CompanyName,
    l.Country,
    COUNT(f.JobKey) AS TotalJobs
FROM FactJobs f
JOIN DimCompany c ON f.CompanyKey = c.CompanyKey
JOIN DimLocation l ON f.LocationKey = l.LocationKey
GROUP BY c.CompanyName, l.Country;
GO