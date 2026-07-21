const express = require("express");
const router = express.Router();

const { getPool } = require("../config/db");


// =====================================================
// MAIN ANALYTICS
// GET /api/admin/analytics
// =====================================================

router.get("/", async (req, res) => {

    try {

        const pool = getPool();

        console.log("========================================");
        console.log("Loading Analytics Data...");
        console.log("========================================");


        // =================================================
        // GET ALL JOBS
        // =================================================

        const jobsResult = await pool
            .request()
            .query(`

                SELECT

                    f.JobKey,

                    c.CompanyName,

                    p.PlatformName,

                    l.FullLocation AS Location,

                    l.City,

                    l.Country,

                    d.FullDate AS PostedDate,

                    f.WorkType,

                    f.ExperienceLevel,

                    f.JobCategory

                FROM FactJobs f

                LEFT JOIN DimCompany c
                    ON f.CompanyKey = c.CompanyKey

                LEFT JOIN DimPlatform p
                    ON f.PlatformKey = p.PlatformKey

                LEFT JOIN DimLocation l
                    ON f.LocationKey = l.LocationKey

                LEFT JOIN DimDate d
                    ON f.DateKey = d.DateKey

                WHERE
                    f.CompanyKey <> -1

                ORDER BY
                    f.JobKey DESC

            `);


        const jobs =
            Array.isArray(jobsResult.recordset)
                ? jobsResult.recordset
                : [];


        console.log(
            `Analytics Jobs Loaded: ${jobs.length}`
        );


        // =================================================
        // JOBS BY CATEGORY
        // =================================================

        const categoryMap = {};


        jobs.forEach((job) => {

            const category =
                job.JobCategory || "Other";


            categoryMap[category] =
                (categoryMap[category] || 0) + 1;

        });


        const jobsByCategory =

            Object.entries(categoryMap)

                .map(([JobCategory, Count]) => ({

                    JobCategory,

                    Count:
                        Number(Count) || 0

                }))

                .sort(
                    (a, b) =>
                        b.Count - a.Count
                );


        // =================================================
        // WORK TYPES
        // =================================================

        const workTypeMap = {};


        jobs.forEach((job) => {

            const workType =
                job.WorkType || "Unknown";


            workTypeMap[workType] =
                (workTypeMap[workType] || 0) + 1;

        });


        const workTypes =

            Object.entries(workTypeMap)

                .map(([WorkType, Count]) => ({

                    WorkType,

                    Count:
                        Number(Count) || 0

                }))

                .sort(
                    (a, b) =>
                        b.Count - a.Count
                );


        // =================================================
        // EXPERIENCE LEVELS
        // =================================================

        const experienceMap = {};


        jobs.forEach((job) => {

            const experience =
                job.ExperienceLevel || "Unknown";


            experienceMap[experience] =
                (experienceMap[experience] || 0) + 1;

        });


        const experience =

            Object.entries(experienceMap)

                .map(([ExperienceLevel, Count]) => ({

                    ExperienceLevel,

                    Count:
                        Number(Count) || 0

                }))

                .sort(
                    (a, b) =>
                        b.Count - a.Count
                );


        // =================================================
        // JOBS BY COMPANY
        // =================================================

        const companyMap = {};


        jobs.forEach((job) => {

            const company =
                job.CompanyName || "Unknown";


            companyMap[company] =
                (companyMap[company] || 0) + 1;

        });


        const companies =

            Object.entries(companyMap)

                .map(([CompanyName, Count]) => ({

                    CompanyName,

                    Count:
                        Number(Count) || 0

                }))

                .sort(
                    (a, b) =>
                        b.Count - a.Count
                );


        // =================================================
        // JOBS BY PLATFORM
        // =================================================

        const platformMap = {};


        jobs.forEach((job) => {

            const platform =
                job.PlatformName || "Unknown";


            platformMap[platform] =
                (platformMap[platform] || 0) + 1;

        });


        const platforms =

            Object.entries(platformMap)

                .map(([PlatformName, Count]) => ({

                    PlatformName,

                    Count:
                        Number(Count) || 0

                }))

                .sort(
                    (a, b) =>
                        b.Count - a.Count
                );


        // =================================================
        // JOBS BY LOCATION
        // =================================================

        const locationMap = {};


        jobs.forEach((job) => {

            const location =
                job.Location || "Unknown";


            locationMap[location] =
                (locationMap[location] || 0) + 1;

        });


        const locations =

            Object.entries(locationMap)

                .map(([Location, Count]) => ({

                    Location,

                    Count:
                        Number(Count) || 0

                }))

                .sort(
                    (a, b) =>
                        b.Count - a.Count
                )

                .slice(0, 15);


        // =================================================
        // JOBS TREND
        // =================================================

        const trendMap = {};


        jobs.forEach((job) => {

            if (!job.PostedDate) {

                return;

            }


            let date;


            if (
                job.PostedDate instanceof Date
            ) {

                date =

                    job.PostedDate
                        .toISOString()
                        .split("T")[0];

            }

            else {

                date =

                    String(
                        job.PostedDate
                    )
                        .split("T")[0];

            }


            if (!date) {

                return;

            }


            trendMap[date] =
                (trendMap[date] || 0) + 1;

        });


        const jobsTrend =

            Object.entries(trendMap)

                .map(([FullDate, Count]) => ({

                    FullDate,

                    Count:
                        Number(Count) || 0

                }))

                .sort(

                    (a, b) =>

                        new Date(a.FullDate) -
                        new Date(b.FullDate)

                );


        // =================================================
        // KPIs
        // =================================================

        const totalJobs =
            Number(jobs.length) || 0;


        const totalCompanies =

            new Set(

                jobs

                    .map(
                        (job) =>
                            job.CompanyName
                    )

                    .filter(

                        (value) =>

                            value &&

                            value !== "Unknown"

                    )

            ).size;


        const totalPlatforms =

            new Set(

                jobs

                    .map(
                        (job) =>
                            job.PlatformName
                    )

                    .filter(

                        (value) =>

                            value &&

                            value !== "Unknown"

                    )

            ).size;


        const totalLocations =

            new Set(

                jobs

                    .map(

                        (job) =>

                            job.Location

                    )

                    .filter(

                        (value) =>

                            value &&

                            value !== "Unknown"

                    )

            ).size;


        // =================================================
        // FINAL RESPONSE
        // =================================================

        const response = {

            success: true,


            kpis: {

                TotalJobs:
                    totalJobs,

                TotalCompanies:
                    Number(totalCompanies) || 0,

                TotalPlatforms:
                    Number(totalPlatforms) || 0,

                TotalLocations:
                    Number(totalLocations) || 0

            },


            jobs,


            jobsByCategory,


            workTypes,


            experience,


            companies,


            platforms,


            locations,


            jobsTrend

        };


        console.log(
            "Analytics KPIs:",
            response.kpis
        );


        console.log(
            "========================================"
        );


        res.status(200).json(
            response
        );

    }

    catch (err) {

        console.error(
            "Main Analytics Error:",
            err
        );


        res.status(500)
            .json({

                success: false,

                message:
                    err.message ||
                    "Failed to load analytics data"

            });

    }

});


// =====================================================
// ANALYTICS JOBS
// GET /api/admin/analytics/jobs
// =====================================================

router.get(
    "/jobs",
    async (req, res) => {

        try {

            const pool =
                getPool();


            const result =
                await pool
                    .request()
                    .query(`

                        SELECT

                            f.JobKey,

                            c.CompanyName,

                            p.PlatformName,

                            l.FullLocation
                                AS Location,

                            l.City,

                            l.Country,

                            d.FullDate
                                AS PostedDate,

                            f.WorkType,

                            f.ExperienceLevel,

                            f.JobCategory

                        FROM FactJobs f

                        LEFT JOIN DimCompany c

                            ON f.CompanyKey =
                                c.CompanyKey

                        LEFT JOIN DimPlatform p

                            ON f.PlatformKey =
                                p.PlatformKey

                        LEFT JOIN DimLocation l

                            ON f.LocationKey =
                                l.LocationKey

                        LEFT JOIN DimDate d

                            ON f.DateKey =
                                d.DateKey

                        WHERE

                            f.CompanyKey <> -1

                        ORDER BY

                            f.JobKey DESC

                    `);


            const jobs =
                Array.isArray(result.recordset)
                    ? result.recordset
                    : [];


            res.status(200).json({

                success: true,

                totalJobs:
                    jobs.length,

                jobs

            });

        }

        catch (err) {

            console.error(
                "Analytics Jobs Error:",
                err
            );


            res.status(500)
                .json({

                    success: false,

                    message:
                        err.message ||
                        "Failed to load analytics jobs"

                });

        }

    }
);


// =====================================================
// LOCATIONS ANALYTICS
// GET /api/admin/analytics/locations
// =====================================================

router.get(
    "/locations",
    async (req, res) => {

        try {

            const pool =
                getPool();


            // =================================================
            // TOTAL LOCATIONS
            // =================================================

            const totalLocationsResult =
                await pool
                    .request()
                    .query(`

                        SELECT

                            COUNT(
                                DISTINCT LocationKey
                            )
                            AS TotalLocations

                        FROM FactJobs

                        WHERE

                            LocationKey <> -1

                    `);


            // =================================================
            // JOBS BY LOCATION
            // =================================================

            const jobsByLocationResult =
                await pool
                    .request()
                    .query(`

                        SELECT TOP 15

                            l.FullLocation
                                AS Location,

                            COUNT(*) AS Jobs

                        FROM FactJobs f

                        JOIN DimLocation l

                            ON f.LocationKey =
                                l.LocationKey

                        WHERE

                            f.CompanyKey <> -1

                            AND

                            l.FullLocation IS NOT NULL

                            AND

                            l.FullLocation <>
                                'Unknown'

                        GROUP BY

                            l.FullLocation

                        ORDER BY

                            Jobs DESC

                    `);


            // =================================================
            // JOBS BY CITY
            // =================================================

            const jobsByCityResult =
                await pool
                    .request()
                    .query(`

                        SELECT TOP 15

                            l.City,

                            COUNT(*) AS Jobs

                        FROM FactJobs f

                        JOIN DimLocation l

                            ON f.LocationKey =
                                l.LocationKey

                        WHERE

                            f.CompanyKey <> -1

                            AND

                            l.City IS NOT NULL

                        GROUP BY

                            l.City

                        ORDER BY

                            Jobs DESC

                    `);


            // =================================================
            // JOBS BY COUNTRY
            // =================================================

            const jobsByCountryResult =
                await pool
                    .request()
                    .query(`

                        SELECT TOP 15

                            l.Country,

                            COUNT(*) AS Jobs

                        FROM FactJobs f

                        JOIN DimLocation l

                            ON f.LocationKey =
                                l.LocationKey

                        WHERE

                            f.CompanyKey <> -1

                            AND

                            l.Country IS NOT NULL

                        GROUP BY

                            l.Country

                        ORDER BY

                            Jobs DESC

                    `);


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                success: true,


                totalLocations: {

                    TotalLocations:

                        Number(

                            totalLocationsResult
                                .recordset?.[0]
                                ?.TotalLocations

                        ) || 0

                },


                jobsByLocation:

                    jobsByLocationResult
                        .recordset || [],


                jobsByCity:

                    jobsByCityResult
                        .recordset || [],


                jobsByCountry:

                    jobsByCountryResult
                        .recordset || []

            });

        }

        catch (err) {

            console.error(
                "Locations Analytics Error:",
                err
            );


            res.status(500)
                .json({

                    success: false,

                    message:
                        err.message ||
                        "Failed to load locations analytics"

                });

        }

    }
);


module.exports = router;