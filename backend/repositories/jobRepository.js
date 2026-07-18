const { getPool, sql } = require("../config/db");

// =========================================
// Delete Job
// =========================================

async function deleteJob(id) {

    const pool = getPool();

    const result = await pool.request()

        .input("id", sql.Int, id)

        .query(`
            DELETE FROM FactJobs
            WHERE JobKey=@id
        `);

    return result.rowsAffected[0];

}

// =========================================
// Add Job
// =========================================

async function addJob(job) {

    const pool = getPool();

    await pool.request()

        .input("CompanyKey", sql.Int, job.CompanyKey)

        .input("LocationKey", sql.Int, job.LocationKey)

        .input("DateKey", sql.Int, job.DateKey)

        .input("PlatformKey", sql.Int, job.PlatformKey)

        .input("JobCode", sql.NVarChar(100), job.JobCode)

        .input("Title", sql.NVarChar(255), job.Title)

        .input("Posted", sql.NVarChar(50), job.Posted)

        .input("WorkType", sql.NVarChar(50), job.WorkType)

        .input("ExperienceLevel", sql.NVarChar(100), job.ExperienceLevel)

        .input("JobCategory", sql.NVarChar(200), job.JobCategory)

        .query(`

            INSERT INTO FactJobs
            (

                CompanyKey,
                LocationKey,
                DateKey,
                PlatformKey,
                JobCode,
                Title,
                Posted,
                WorkType,
                ExperienceLevel,
                JobCategory

            )

            VALUES
            (

                @CompanyKey,
                @LocationKey,
                @DateKey,
                @PlatformKey,
                @JobCode,
                @Title,
                @Posted,
                @WorkType,
                @ExperienceLevel,
                @JobCategory

            )

        `);

    return true;

}
// =========================================
// Update Job
// =========================================

async function updateJob(id, job) {

    const pool = getPool();

    const result = await pool.request()

        .input("id", sql.Int, id)

        .input("CompanyKey", sql.Int, job.CompanyKey)
        .input("LocationKey", sql.Int, job.LocationKey)
        .input("DateKey", sql.Int, job.DateKey)
        .input("PlatformKey", sql.Int, job.PlatformKey)

        .input("JobCode", sql.NVarChar(100), job.JobCode)
        .input("Title", sql.NVarChar(255), job.Title)
        .input("Posted", sql.NVarChar(50), job.Posted)
        .input("WorkType", sql.NVarChar(50), job.WorkType)
        .input("ExperienceLevel", sql.NVarChar(100), job.ExperienceLevel)
        .input("JobCategory", sql.NVarChar(200), job.JobCategory)

        .query(`

            UPDATE FactJobs
            SET

                CompanyKey=@CompanyKey,
                LocationKey=@LocationKey,
                DateKey=@DateKey,
                PlatformKey=@PlatformKey,
                JobCode=@JobCode,
                Title=@Title,
                Posted=@Posted,
                WorkType=@WorkType,
                ExperienceLevel=@ExperienceLevel,
                JobCategory=@JobCategory

            WHERE JobKey=@id

        `);

    return result.rowsAffected[0];

}
module.exports = {

    addJob,

    updateJob,

    deleteJob

};