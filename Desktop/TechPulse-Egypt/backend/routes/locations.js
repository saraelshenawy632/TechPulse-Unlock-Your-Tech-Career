// routes/locations.js
const express = require("express");
const router = express.Router();
const { getPool } = require("../config/db");

// ==========================================
// GET TOP LOCATIONS (توزيع الوظائف جغرافياً)
// ==========================================
router.get("/", async (req, res) => {
  try {
    const pool = getPool();

    // جلب أعلى المدن طلباً للوظائف بناءً على عمود City الفعلي في قاعدة البيانات
    const result = await pool.request().query(`
      SELECT TOP 5 
          COALESCE(l.City, 'Other') AS LocationName,
          COUNT(f.CompanyKey) AS JobCount,
          CAST(ROUND(CAST(COUNT(f.CompanyKey) AS FLOAT) * 100 / 
              NULLIF((SELECT COUNT(*) FROM FactJobs), 0), 1) AS DECIMAL(5,1)) AS Percentage
      FROM FactJobs f
      LEFT JOIN DimLocation l ON f.LocationKey = l.LocationKey
      GROUP BY l.City
      ORDER BY JobCount DESC;
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Database error in top-locations:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;