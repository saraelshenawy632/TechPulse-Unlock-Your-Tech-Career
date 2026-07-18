const { getPool, sql } = require("../config/db");



// GET APPLICATIONS

const getApplications = async()=>{


    const pool = getPool();


    const result = await pool.request()

    .query(`


        SELECT

        A.ApplicationID,

        A.ApplicantName,

        A.ApplicantEmail,

        A.ResumeURL,

        A.LinkedInURL,

        A.AppliedAt,

        A.Status,


        F.Title AS JobTitle,


        C.CompanyName


        FROM JobApplications A


        INNER JOIN FactJobs F

        ON A.JobID = F.JobKey


        INNER JOIN DimCompany C

        ON F.CompanyKey = C.CompanyKey


        ORDER BY A.AppliedAt DESC


    `);



    return result.recordset;


};







// UPDATE STATUS


const updateStatus = async(id,status)=>{


    const pool=getPool();



    await pool.request()

    .input(
        "id",
        sql.Int,
        id
    )

    .input(
        "status",
        sql.NVarChar,
        status
    )

    .query(`


        UPDATE JobApplications


        SET Status=@status


        WHERE ApplicationID=@id


    `);


};









// DELETE APPLICATION


const deleteApplication = async(id)=>{


    const pool=getPool();



    await pool.request()

    .input(
        "id",
        sql.Int,
        id
    )

    .query(`


        DELETE FROM JobApplications


        WHERE ApplicationID=@id


    `);



};






module.exports={

    getApplications,

    updateStatus,

    deleteApplication

};