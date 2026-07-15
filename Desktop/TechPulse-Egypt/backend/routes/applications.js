// routes/applications.js
const express = require('express');
const router = express.Router();
// ✅ استدعاء الاتصال المفتوح ومكتبة sql المهيأة بالدرايفر الخاص بكِ
const { sql, getPool } = require('../config/db'); 

// مسار إرسال طلب تقديم جديد
router.post('/applications', async (req, res) => {
    const { JobID, ApplicantName, ApplicantEmail, ResumeURL, LinkedInURL } = req.body;

    // التحقق من إدخال البيانات الأساسية المطلوبة
    if (!JobID || !ApplicantName || !ApplicantEmail) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required fields (JobID, ApplicantName, or ApplicantEmail)." 
        });
    }

    try {
        // ✅ جلب الـ pool الجاهز والمتصل بالفعل بدلاً من محاولة الاتصال من جديد
        const pool = getPool(); 
        
        await pool.request()
            .input('JobID', sql.Int, parseInt(JobID))
            .input('ApplicantName', sql.NVarChar(150), ApplicantName)
            .input('ApplicantEmail', sql.NVarChar(150), ApplicantEmail)
            .input('ResumeURL', sql.NVarChar(2083), ResumeURL || null)
            .input('LinkedInURL', sql.NVarChar(2083), LinkedInURL || null)
            .query(`
                INSERT INTO JobApplications (JobID, ApplicantName, ApplicantEmail, ResumeURL, LinkedInURL)
                VALUES (@JobID, @ApplicantName, @ApplicantEmail, @ResumeURL, @LinkedInURL)
            `);

        return res.status(201).json({ 
            success: true, 
            message: "Application submitted and saved to database successfully!" 
        });

    } catch (error) {
        console.error("Database insertion error details:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error. Failed to save application to the database.",
            errorDetails: error.message 
        });
    }
});

module.exports = router;