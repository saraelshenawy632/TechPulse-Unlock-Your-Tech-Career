const express = require("express");

const router = express.Router();


const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const {
    getPool,
    sql
} = require("../config/db");


const jobController =
    require("../controllers/jobController");


const applicationController =
    require("../controllers/applicationController");


// ==========================================
// Admin Dashboard
// ==========================================

router.get(

    "/dashboard",

    authMiddleware,

    adminMiddleware,

    async (req, res) => {

        try {

            const pool = getPool();


            // =====================================
            // Dashboard KPIs
            // =====================================

            const dashboardResult =

                await pool
                    .request()
                    .query(`

                        SELECT *

                        FROM vw_DashboardKPIs

                    `);


            // =====================================
            // Users
            // =====================================

            const usersResult =

                await pool
                    .request()
                    .query(`

                        SELECT

                            Id,

                            Name,

                            Email,

                            Role,

                            CreatedAt

                        FROM Users

                        ORDER BY CreatedAt DESC

                    `);


            // =====================================
            // Recent Jobs
            // =====================================

            const jobsResult =

                await pool
                    .request()
                    .query(`

                        SELECT TOP (10)

                            JobKey,

                            CompanyName,

                            City,

                            Country,

                            Title,

                            Posted,

                            FullDate,

                            WorkType,

                            ExperienceLevel,

                            JobCategory

                        FROM vw_JobDetailsFixed

                        ORDER BY FullDate DESC

                    `);


            // =====================================
            // Applications
            // =====================================

            let applications = [];


            try {

                const applicationsResult =

                    await pool
                        .request()
                        .query(`

                            SELECT TOP (10)

                                ApplicationID,

                                ApplicantName,

                                ApplicantEmail,

                                ResumeURL,

                                LinkedInURL,

                                AppliedAt,

                                Status,

                                JobID

                            FROM JobApplications

                            ORDER BY ApplicationID DESC

                        `);


                applications =
                    applicationsResult.recordset;

            }

            catch (err) {

                console.log(

                    "Applications Error:",

                    err.message

                );

            }


            // =====================================
            // Response
            // =====================================

            res.json({

                success: true,

                dashboard:
                    dashboardResult.recordset[0],

                users:
                    usersResult.recordset,

                jobs:
                    jobsResult.recordset,

                applications

            });

        }

        catch (err) {

            console.log(err);


            res.status(500)
                .json({

                    success: false,

                    message:
                        err.message

                });

        }

    }

);


// ==========================================
// Admin Analytics
// ==========================================

router.get(

    "/analytics",

    authMiddleware,

    adminMiddleware,

    async (req, res) => {

        try {

            const pool = getPool();


            // =====================================
            // Jobs By Category
            // =====================================

            const categoryResult =

                await pool
                    .request()
                    .query(`

                        SELECT

                            ISNULL(
                                JobCategory,
                                'Other'
                            ) AS JobCategory,

                            COUNT(*) AS Count

                        FROM vw_JobDetailsFixed

                        GROUP BY JobCategory

                        ORDER BY Count DESC

                    `);


            // =====================================
            // Work Types Distribution
            // =====================================

            const workTypeResult =

                await pool
                    .request()
                    .query(`

                        SELECT

                            ISNULL(
                                WorkType,
                                'Unknown'
                            ) AS WorkType,

                            COUNT(*) AS Count

                        FROM vw_JobDetailsFixed

                        GROUP BY WorkType

                        ORDER BY Count DESC

                    `);


            // =====================================
            // Jobs By Company
            // =====================================

            const companyResult =

                await pool
                    .request()
                    .query(`

                        SELECT TOP (10)

                            CompanyName,

                            COUNT(*) AS Count

                        FROM vw_JobDetailsFixed

                        WHERE CompanyName IS NOT NULL

                        GROUP BY CompanyName

                        ORDER BY Count DESC

                    `);


            // =====================================
            // Jobs By Location
            // =====================================

            const locationResult =

                await pool
                    .request()
                    .query(`

                        SELECT TOP (10)

                            City,

                            Country,

                            COUNT(*) AS Count

                        FROM vw_JobDetailsFixed

                        WHERE City IS NOT NULL

                        GROUP BY

                            City,

                            Country

                        ORDER BY Count DESC

                    `);


            // =====================================
            // Response
            // =====================================

            res.json({

                success: true,

                jobsByCategory:
                    categoryResult.recordset,

                workTypes:
                    workTypeResult.recordset,

                companies:
                    companyResult.recordset,

                locations:
                    locationResult.recordset

            });

        }

        catch (err) {

            console.log(

                "Analytics Error:",

                err

            );


            res.status(500)
                .json({

                    success: false,

                    message:
                        err.message

                });

        }

    }

);


// ==========================================
// Applications Management
// ==========================================

router.get(

    "/applications",

    authMiddleware,

    adminMiddleware,

    applicationController.getApplications

);


router.get(

    "/applications/:id",

    authMiddleware,

    adminMiddleware,

    applicationController.getApplicationById

);


router.put(

    "/applications/:id",

    authMiddleware,

    adminMiddleware,

    applicationController.updateStatus

);


router.delete(

    "/applications/:id",

    authMiddleware,

    adminMiddleware,

    applicationController.deleteApplication

);


// ==========================================
// Jobs Management
// ==========================================

router.delete(

    "/jobs/:id",

    authMiddleware,

    adminMiddleware,

    jobController.deleteJob

);


router.post(

    "/jobs",

    authMiddleware,

    adminMiddleware,

    jobController.addJob

);


router.put(

    "/jobs/:id",

    authMiddleware,

    adminMiddleware,

    jobController.updateJob

);


// ==========================================
// Users Management
// ==========================================

router.put(

    "/users/:id/role",

    authMiddleware,

    adminMiddleware,

    async (req, res) => {

        try {

            const pool = getPool();


            const {
                role
            } = req.body;


            await pool
                .request()

                .input(
                    "id",
                    sql.Int,
                    req.params.id
                )

                .input(
                    "role",
                    sql.NVarChar,
                    role
                )

                .query(`

                    UPDATE Users

                    SET Role = @role

                    WHERE Id = @id

                `);


            res.json({

                success: true,

                message:
                    "Role Updated Successfully"

            });

        }

        catch (err) {

            console.log(err);


            res.status(500)
                .json({

                    success: false,

                    message:
                        err.message

                });

        }

    }

);


// ==========================================
// Get Jobs With Pagination
// ==========================================

router.get(

    "/jobs",

    authMiddleware,

    adminMiddleware,

    async (req, res) => {

        try {

            const pool = getPool();


            const page =

                parseInt(
                    req.query.page
                ) || 1;


            const limit =

                parseInt(
                    req.query.limit
                ) || 10;


            const offset =

                (page - 1) * limit;


            // =====================================
            // Paginated Jobs
            // =====================================

            const jobsResult =

                await pool
                    .request()

                    .input(
                        "offset",
                        sql.Int,
                        offset
                    )

                    .input(
                        "limit",
                        sql.Int,
                        limit
                    )

                    .query(`

                        SELECT

                            JobKey,

                            CompanyName,

                            City,

                            Country,

                            Title,

                            Posted,

                            FullDate,

                            WorkType,

                            ExperienceLevel,

                            JobCategory

                        FROM vw_JobDetailsFixed

                        ORDER BY FullDate DESC

                        OFFSET @offset ROWS

                        FETCH NEXT @limit ROWS ONLY

                    `);


            // =====================================
            // Total Jobs
            // =====================================

            const countResult =

                await pool
                    .request()
                    .query(`

                        SELECT

                            COUNT(*) AS total

                        FROM vw_JobDetailsFixed

                    `);


            const total =

                countResult
                    .recordset[0]
                    .total;


            // =====================================
            // Response
            // =====================================

            res.json({

                success: true,

                jobs:
                    jobsResult.recordset,

                total,

                page,

                totalPages:

                    Math.ceil(
                        total / limit
                    )

            });

        }

        catch (err) {

            console.log(err);


            res.status(500)
                .json({

                    success: false,

                    message:
                        err.message

                });

        }

    }

);


module.exports = router;