const express = require("express");
const router = express.Router();

const { getPool } = require("../config/db");


// ====================================
// Companies
// ====================================

router.get("/", async (req, res) => {

    try {

        const pool = getPool();

        const result = await pool.request().query(`

           SELECT

    c.CompanyKey,
    c.CompanyName,
    c.Platform,
    c.Industry,
    c.Logo,
    COUNT(DISTINCT f.JobCode) AS Jobs

FROM DimCompany c

LEFT JOIN FactJobs f

ON c.CompanyKey = f.CompanyKey

WHERE c.CompanyName IS NOT NULL
AND c.CompanyName <> 'Unknown'

GROUP BY

    c.CompanyKey,
    c.CompanyName,
    c.Platform,
    c.Industry,
    c.Logo

ORDER BY Jobs DESC

        `);


        res.json(result.recordset);


    }

    catch(err){

        console.log("Companies API Error:", err);

        res.status(500).json({
            message: err.message
        });

    }

});


module.exports = router;