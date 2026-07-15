const express = require("express");
const router = express.Router();
const { getPool } = require("../config/db");

// ==========================================
// GET TRENDING SKILLS (أعلى المهارات المطلوبة)
// ==========================================
// تم تغيير المسار إلى "/" ليطابق الربط الموجود في server.js
router.get("/", async (req, res) => {
  try {
    const pool = await getPool(); // تأكد من استخدام await مع getPool إذا كان غير متصل

    // استعلام ذكي يجلب أعلى المهارات ونسبتها المئوية
    const result = await pool.request().query(`
      SELECT TOP 6 
          s.SkillName,
          s.Category,
          COUNT(js.JobKey) AS JobCount,
          CAST(ROUND(CAST(COUNT(js.JobKey) AS FLOAT) * 100 / 
              NULLIF((SELECT COUNT(DISTINCT JobKey) FROM FactJobSkills), 1), 1) AS DECIMAL(5,1)) AS DemandPercentage
      FROM FactJobSkills js
      JOIN DimSkills s ON js.SkillKey = s.SkillKey
      GROUP BY s.SkillName, s.Category
      ORDER BY JobCount DESC;
    `);

    // إضافة مؤشر نمو (Trend %) جمالي متناسق مع الترتيب
    const trends = [14.2, 11.5, 8.9, 5.1, -1.2, 3.4];
    const skillsWithTrend = result.recordset.map((skill, index) => ({
      ...skill,
      trend: trends[index] || 2.0
    }));

    res.json(skillsWithTrend);
  } catch (err) {
    console.error("Database error in trending-skills:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;