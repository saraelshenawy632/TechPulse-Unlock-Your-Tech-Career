--1) Top Companies
SELECT
    c.CompanyName,
    COUNT(*) AS JobsCount
FROM FactJobs f
JOIN DimCompany c
ON f.CompanyKey = c.CompanyKey
GROUP BY c.CompanyName
ORDER BY JobsCount DESC;
--2) Jobs By Platform
SELECT
    p.PlatformName,
    COUNT(*) AS JobsCount
FROM FactJobs f
JOIN DimPlatform p
ON f.PlatformKey = p.PlatformKey
GROUP BY p.PlatformName
ORDER BY JobsCount DESC;
--3) Jobs By Country
SELECT
    l.Country,
    COUNT(*) AS JobsCount
FROM FactJobs f
JOIN DimLocation l
ON f.LocationKey = l.LocationKey
GROUP BY l.Country
ORDER BY JobsCount DESC;
--4) Monthly Trend
SELECT
    YEAR(d.FullDate) AS Year,
    MONTH(d.FullDate) AS Month,
    COUNT(*) AS JobsCount
FROM FactJobs f
JOIN DimDate d
ON f.DateKey = d.DateKey
GROUP BY 
    YEAR(d.FullDate),
    MONTH(d.FullDate)
ORDER BY Year, Month;