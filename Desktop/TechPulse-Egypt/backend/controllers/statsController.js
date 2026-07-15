const { getPool } = require("../config/db");

const getStats = async (req, res) => {
  try {

    const pool = getPool();

    const result = await pool.request().query(`
      SELECT

        COUNT(*) AS jobs,

        COUNT(DISTINCT CASE
            WHEN CompanyName IS NOT NULL
             AND CompanyName NOT IN ('Unknown','Not Specified','N/A')
            THEN CompanyName
        END) AS companies,

        COUNT(DISTINCT CASE
            WHEN City IS NOT NULL
             AND City NOT IN ('Unknown','Remote','Not Specified','N/A')
            THEN City
        END) AS cities,

        COUNT(DISTINCT CASE
            WHEN Country IS NOT NULL
             AND Country NOT IN ('Unknown','Remote','Not Specified','N/A')
            THEN Country
        END) AS countries

      FROM vw_JobDetailsFixed;
    `);

    res.json(result.recordset[0]);

  } catch (err) {

    console.error("Stats Controller Error:", err);

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  getStats
};