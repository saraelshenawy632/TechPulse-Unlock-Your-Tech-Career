const express = require("express");
const router = express.Router();

const { getPool } = require("../config/db");




// =====================================
// MAIN ANALYTICS
// =====================================


router.get("/", async (req,res)=>{


try{


const pool = getPool();



// ================= KPI =================


const kpis = await pool.request().query(`


SELECT


COUNT(*) AS TotalJobs,


COUNT(DISTINCT CompanyKey) AS TotalCompanies,


COUNT(DISTINCT PlatformKey) AS TotalPlatforms,


COUNT(DISTINCT LocationKey) AS TotalLocations



FROM FactJobs


WHERE CompanyKey <> -1



`);







// ================= COMPANY =================


const jobsByCompany = await pool.request().query(`


SELECT TOP 10


c.CompanyName,


COUNT(*) AS Jobs



FROM FactJobs f



JOIN DimCompany c


ON f.CompanyKey=c.CompanyKey



WHERE c.CompanyName <> 'Unknown'



GROUP BY c.CompanyName



ORDER BY Jobs DESC



`);







// ================= PLATFORM =================


const jobsByPlatform = await pool.request().query(`


SELECT


p.PlatformName,


COUNT(*) AS Jobs



FROM FactJobs f



JOIN DimPlatform p


ON f.PlatformKey=p.PlatformKey



WHERE p.PlatformName <> 'Unknown'



GROUP BY p.PlatformName



ORDER BY Jobs DESC



`);








// ================= WORK TYPE =================


const workType = await pool.request().query(`


SELECT


WorkType,


COUNT(*) AS Jobs



FROM FactJobs



WHERE WorkType IS NOT NULL



GROUP BY WorkType



ORDER BY Jobs DESC



`);







// ================= EXPERIENCE =================


const experience = await pool.request().query(`


SELECT


ExperienceLevel,


COUNT(*) AS Jobs



FROM FactJobs



WHERE ExperienceLevel IS NOT NULL



GROUP BY ExperienceLevel



ORDER BY Jobs DESC



`);







// ================= CATEGORY =================


const jobCategories = await pool.request().query(`


SELECT TOP 8


JobCategory,


COUNT(*) AS Jobs



FROM FactJobs



WHERE


JobCategory IS NOT NULL


AND JobCategory <> 'Other'



GROUP BY JobCategory



ORDER BY Jobs DESC



`);







// ================= COMPANIES FILTER =================


const companies = await pool.request().query(`


SELECT DISTINCT


c.CompanyName



FROM FactJobs f



JOIN DimCompany c


ON f.CompanyKey=c.CompanyKey



WHERE c.CompanyName <> 'Unknown'



ORDER BY c.CompanyName



`);








// ================= TREND =================


const jobsTrend = await pool.request().query(`


SELECT


d.FullDate,


COUNT(*) AS Jobs



FROM FactJobs f



JOIN DimDate d


ON f.DateKey=d.DateKey



GROUP BY d.FullDate



ORDER BY d.FullDate



`);







res.json({


kpis:
kpis.recordset[0],



jobsByCompany:
jobsByCompany.recordset,



jobsByPlatform:
jobsByPlatform.recordset,



workType:
workType.recordset,



experience:
experience.recordset,



jobCategories:
jobCategories.recordset,



companies:
companies.recordset.map(
x=>x.CompanyName
),



jobsTrend:
jobsTrend.recordset



});



}



catch(err){


console.log(err);


res.status(500).json({

message:err.message

});


}



});









// =====================================
// ALL JOBS FILTER DATA
// =====================================



router.get("/jobs", async(req,res)=>{


try{


const pool=getPool();



const result = await pool.request().query(`


SELECT



c.CompanyName,


p.PlatformName,


l.FullLocation AS Location,


d.FullDate AS PostedDate,


f.WorkType,


f.ExperienceLevel,


f.JobCategory



FROM FactJobs f



JOIN DimCompany c


ON f.CompanyKey=c.CompanyKey




JOIN DimPlatform p


ON f.PlatformKey=p.PlatformKey




JOIN DimLocation l


ON f.LocationKey=l.LocationKey




JOIN DimDate d


ON f.DateKey=d.DateKey




WHERE


c.CompanyName <> 'Unknown'


AND


p.PlatformName <> 'Unknown'



`);




res.json(result.recordset);



}



catch(err){


console.log(err);


res.status(500).json({

message:err.message

});


}


});









// =====================================
// LOCATIONS ANALYTICS
// =====================================



router.get("/locations", async(req,res)=>{


try{


const pool=getPool();





// Total Locations


const totalLocations = await pool.request().query(`


SELECT


COUNT(DISTINCT LocationKey)
AS TotalLocations



FROM FactJobs



WHERE LocationKey <> -1



`);








// Jobs By Full Location


const jobsByLocation = await pool.request().query(`


SELECT TOP 15


l.FullLocation AS Location,


COUNT(*) AS Jobs



FROM FactJobs f



JOIN DimLocation l


ON f.LocationKey=l.LocationKey



WHERE


l.FullLocation IS NOT NULL



AND


l.FullLocation <> 'Unknown'



GROUP BY l.FullLocation



ORDER BY Jobs DESC



`);








// Jobs By City


const jobsByCity = await pool.request().query(`


SELECT TOP 15


l.City,


COUNT(*) AS Jobs



FROM FactJobs f



JOIN DimLocation l


ON f.LocationKey=l.LocationKey



WHERE


l.City IS NOT NULL



GROUP BY l.City



ORDER BY Jobs DESC



`);








// Jobs By Country


const jobsByCountry = await pool.request().query(`


SELECT TOP 15


l.Country,


COUNT(*) AS Jobs



FROM FactJobs f



JOIN DimLocation l


ON f.LocationKey=l.LocationKey



WHERE


l.Country IS NOT NULL



GROUP BY l.Country



ORDER BY Jobs DESC



`);







res.json({


totalLocations:
totalLocations.recordset[0],



jobsByLocation:
jobsByLocation.recordset,



jobsByCity:
jobsByCity.recordset,



jobsByCountry:
jobsByCountry.recordset



});



}



catch(err){


console.log(err);


res.status(500).json({

message:err.message

});


}



});








module.exports = router;