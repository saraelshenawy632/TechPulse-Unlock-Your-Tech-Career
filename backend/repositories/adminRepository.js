const { getPool } = require("../config/db");

async function getDashboardStats() {

    const pool = getPool();

    const totalJobs = await pool.request().query(`
        SELECT COUNT(*) AS Total
        FROM FactJobs
    `);

    const totalUsers = await pool.request().query(`
        SELECT COUNT(*) AS Total
        FROM Users
    `);

    const totalCompanies = await pool.request().query(`
        SELECT COUNT(*) AS Total
        FROM DimCompany
    `);

    const totalApplications = await pool.request().query(`
        SELECT COUNT(*) AS Total
        FROM JobApplications
    `);

    return {

        totalJobs: totalJobs.recordset[0].Total,

        totalUsers: totalUsers.recordset[0].Total,

        totalCompanies: totalCompanies.recordset[0].Total,

        totalApplications: totalApplications.recordset[0].Total

    };

}

module.exports = {

    getDashboardStats

};