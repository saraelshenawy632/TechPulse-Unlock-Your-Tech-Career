const express = require("express");
const router = express.Router();

const sql = require("mssql/msnodesqlv8");
const { getPool } = require("../config/db");

// ======================================================
// GET JOBS
// ======================================================

router.get("/", async (req, res) => {

    try {

        const pool = getPool();

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const offset = (page - 1) * limit;

        const {
            search,
            company,
            category,
            workType,
            experience,
            city,
            country
        } = req.query;

        let where = "WHERE 1=1";

        const request = pool.request();

        if (search) {

            where += `
            AND
            (
                Title LIKE @search
                OR CompanyName LIKE @search
                OR City LIKE @search
                OR Country LIKE @search
            )
            `;

            request.input(
                "search",
                sql.NVarChar,
                `%${search}%`
            );

        }

        if (company) {

            where += " AND CompanyName=@company";

            request.input(
                "company",
                sql.NVarChar,
                company
            );

        }

        if (category) {

            where += " AND JobCategory=@category";

            request.input(
                "category",
                sql.NVarChar,
                category
            );

        }

        if (workType) {

            where += " AND WorkType=@workType";

            request.input(
                "workType",
                sql.NVarChar,
                workType
            );

        }

        if (experience) {

            where += " AND ExperienceLevel=@experience";

            request.input(
                "experience",
                sql.NVarChar,
                experience
            );

        }

        if (city) {

            where += " AND City=@city";

            request.input(
                "city",
                sql.NVarChar,
                city
            );

        }

        if (country) {

            where += " AND Country=@country";

            request.input(
                "country",
                sql.NVarChar,
                country
            );

        }

        //---------------------------------------------------
        // COUNT
        //---------------------------------------------------

        const totalResult = await request.query(`

            SELECT COUNT(*) AS Total

            FROM vw_JobDetailsFixed

            ${where}

        `);

        //---------------------------------------------------
        // DATA
        //---------------------------------------------------

        const request2 = pool.request();

        if (search)
            request2.input("search", sql.NVarChar, `%${search}%`);

        if (company)
            request2.input("company", sql.NVarChar, company);

        if (category)
            request2.input("category", sql.NVarChar, category);

        if (workType)
            request2.input("workType", sql.NVarChar, workType);

        if (experience)
            request2.input("experience", sql.NVarChar, experience);

        if (city)
            request2.input("city", sql.NVarChar, city);

        if (country)
            request2.input("country", sql.NVarChar, country);

        request2.input(
            "offset",
            sql.Int,
            offset
        );

        request2.input(
            "limit",
            sql.Int,
            limit
        );

        const result = await request2.query(`

            SELECT

                JobKey,

                JobCode,

                Title,

                CompanyName,

                PlatformName,

                Platform,

                Industry,

                City,

                Country,

                FullLocation,

                Posted,

                FullDate,

                WorkType,

                ExperienceLevel,

                JobCategory

            FROM vw_JobDetailsFixed

            ${where}

            ORDER BY JobKey DESC

            OFFSET @offset ROWS

            FETCH NEXT @limit ROWS ONLY

        `);

        console.log("Jobs:", result.recordset.length);

        console.log("Total:", totalResult.recordset[0].Total);

        res.json({

            jobs: result.recordset,

            total: totalResult.recordset[0].Total,

            currentPage: page,

            totalPages: Math.ceil(
                totalResult.recordset[0].Total / limit
            )

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================================
// LATEST JOBS
// ======================================================

router.get("/latest/list", async (req, res) => {

    try {

        const pool = getPool();

        const result = await pool.request().query(`

            SELECT TOP(6)

                JobKey,

                JobCode,

                Title,

                CompanyName,

                PlatformName,

                City,

                Country,

                FullLocation,

                Posted,

                FullDate,

                WorkType,

                ExperienceLevel,

                JobCategory

            FROM vw_JobDetailsFixed

            ORDER BY JobKey DESC

        `);

        res.json(result.recordset);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================================
// JOB DETAILS
// ======================================================

router.get("/:jobKey", async (req, res) => {

    try {

        const pool = getPool();

        const result = await pool.request()

            .input(
                "jobKey",
                sql.Int,
                req.params.jobKey
            )

            .query(`

                SELECT *

                FROM vw_JobDetailsFixed

                WHERE JobKey=@jobKey

            `);

        if (!result.recordset.length) {

            return res.status(404).json({

                message: "Job not found"

            });

        }

        res.json(result.recordset[0]);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;