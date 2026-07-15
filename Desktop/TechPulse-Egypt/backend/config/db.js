// config/db.js
const sql = require("mssql/msnodesqlv8");
console.log("📦 Driver loaded: msnodesqlv8");
require("dotenv").config();

const config = {
    connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;TrustServerCertificate=Yes;`
};

let pool = null;

const connectDB = async () => {
    try {
        if (!pool) {
            console.log("⏳ Connecting to SQL Server...");
            pool = await new sql.ConnectionPool(config).connect();
            console.log("✅ SQL Server Connected Successfully");
        }
        return pool;
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error("Database not connected. Pool is empty.");
    }
    return pool;
};

module.exports = {
    connectDB,
    getPool,
    sql // تصدير الكائن المهيأ بالدرايفر الصحيح لتوحيد بيئة عمل التطبيق
};