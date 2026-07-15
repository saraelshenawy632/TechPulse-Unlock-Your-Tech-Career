const { getPool } = require("../config/db");

// ============================================
// Latest Jobs
// ============================================
const getLatestJobs = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
        SELECT TOP (6)
            JobKey,
            JobCode,
            Title,
            CompanyName,
            PlatformName,
            City,
            Country,
            FullLocation,
            WorkType,
            ExperienceLevel,
            JobCategory,
            Posted
        FROM vw_JobDetailsFixed
        ORDER BY FullDate DESC, JobKey DESC
    `);

    res.json(result.recordset);

  } catch (error) {
    console.error("Latest Jobs Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================================
// Search Jobs
// ============================================
const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      category,
      company,
      workType,
      experience,
      city,
      country,
      page = 1,
      limit = 12,
    } = req.query;

    const offset = (page - 1) * limit;
    const pool = getPool();

    const request = pool.request();

    let where = " WHERE 1=1 ";

    if (keyword) {
      where += `
        AND (
            Title LIKE @keyword
            OR CompanyName LIKE @keyword
            OR JobCategory LIKE @keyword
            OR City LIKE @keyword
        )
      `;
      request.input("keyword", `%${keyword}%`);
    }

    if (company) {
      where += " AND CompanyName = @company ";
      request.input("company", company);
    }

    if (category) {
      where += " AND JobCategory = @category ";
      request.input("category", category);
    }

    if (workType) {
      where += " AND WorkType = @workType ";
      request.input("workType", workType);
    }

    if (experience) {
      where += " AND ExperienceLevel = @experience ";
      request.input("experience", experience);
    }

    if (city) {
      where += " AND City = @city ";
      request.input("city", city);
    }

    if (country) {
      where += " AND Country = @country ";
      request.input("country", country);
    }

    // حساب إجمالي السجلات
    const totalQuery = `
        SELECT COUNT(*) AS Total
        FROM vw_JobDetailsFixed
        ${where}
    `;

    const total = await request.query(totalQuery);

    // إنشاء Request جديد للاستعلام الفعلي لتجنب تكرار البارامترات
    const dataRequest = pool.request();

    if (keyword) dataRequest.input("keyword", `%${keyword}%`);
    if (company) dataRequest.input("company", company);
    if (category) dataRequest.input("category", category);
    if (workType) dataRequest.input("workType", workType);
    if (experience) dataRequest.input("experience", experience);
    if (city) dataRequest.input("city", city);
    if (country) dataRequest.input("country", country);

    dataRequest.input("offset", Number(offset));
    dataRequest.input("limit", Number(limit));

    const jobsQuery = `
        SELECT
            JobKey,
            JobCode,
            Title,
            CompanyName,
            PlatformName,
            City,
            Country,
            FullLocation,
            WorkType,
            ExperienceLevel,
            JobCategory,
            Posted,
            FullDate
        FROM vw_JobDetailsFixed

        ${where}

        ORDER BY FullDate DESC, JobKey DESC

        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `;

    const jobs = await dataRequest.query(jobsQuery);

    res.json({
      jobs: jobs.recordset,
      total: total.recordset[0].Total,
      currentPage: Number(page),
      totalPages: Math.ceil(total.recordset[0].Total / limit),
    });

  } catch (error) {
    console.error("Search Jobs Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLatestJobs,
  searchJobs,
};