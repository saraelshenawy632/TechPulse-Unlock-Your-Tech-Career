const repository = require("../repositories/applicationRepository");
const { sql, getPool } = require("../config/db"); // افتراض مسار قاعدة البيانات

const getApplications = async () => {
    return await repository.getApplications();
};

const updateStatus = async (id, status) => {
    const allowedStatus = ["Pending", "Accepted", "Rejected"];
    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status");
    }
    return await repository.updateStatus(id, status);
};

const deleteApplication = async (id) => {
    return await repository.deleteApplication(id);
};

async function getApplicationById(id) {
    const pool = await getPool(); // يجب إضافة await لأن getPool غالباً تعيد promise
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT 
                ja.ApplicationID,
                ja.ApplicantName,
                ja.ApplicantEmail,
                ja.ResumeURL,
                ja.LinkedInURL,
                ja.AppliedAt,
                ja.Status,
                fj.Title AS JobTitle,
                dc.CompanyName
            FROM JobApplications ja
            JOIN FactJobs fj ON ja.JobID = fj.JobKey
            JOIN DimCompany dc ON fj.CompanyKey = dc.CompanyKey
            WHERE ja.ApplicationID = @id
        `);

    return result.recordset[0];
}

module.exports = {
    getApplications,
    updateStatus,
    deleteApplication,
    getApplicationById // تمت إضافتها هنا
};