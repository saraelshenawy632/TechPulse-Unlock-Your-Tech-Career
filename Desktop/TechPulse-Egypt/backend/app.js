const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();

// ================================
// Routes
// ================================
const companiesRoutes = require("./routes/companies");
const statsRoutes = require("./routes/statsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const jobsRoute = require("./routes/jobs");
const authRoutes = require("./routes/authRoute");
const applicationRoutes = require('./routes/applications');
const skillsRoutes = require("./routes/skills"); 
const locationsRoutes = require("./routes/locations"); 

// ================================
// Middlewares
// ================================
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

// ================================
// API Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/jobs", jobsRoute);
app.use("/api/analytics", analyticsRoutes);
app.use('/api', applicationRoutes);

// ربط مسار المهارات (سيعمل على الرابط: /api/trending-skills)
app.use("/api/trending-skills", skillsRoutes); 

// ربط مسار المواقع (سيعمل على الرابط: /api/locations)
app.use("/api/locations", locationsRoutes); 


// ================================
// Health Check
// ================================
app.get("/", (req, res) => {
    res.json({
        message: "TechPulse Egypt API Running 🚀"
    });
});

// ================================
// 🛡️ JSON Error Handler Middlewares (مهم جداً لمنع انهيار الـ Frontend)
// ================================

// 1. معالجة الـ 404 للمسارات غير الموجودة وإرجاع رسالة JSON بدلاً من صفحة HTML
app.use((req, res, next) => {
    res.status(404).json({ 
        error: "Not Found",
        message: `المسار [${req.method}] ${req.originalUrl} غير موجود في السيرفر. تأكد من إعدادات الـ Routes.` 
    });
});

// 2. معالجة الأخطاء الداخلية للسيرفر (500) وإرجاعها كـ JSON
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ 
        error: "Internal Server Error",
        message: err.message 
    });
});

// ================================
// Server
// ================================
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log("================================");
            console.log("✅ SQL Server Connected Successfully");
            console.log(`🚀 Server Running on Port ${PORT}`);
            console.log("================================");
        });
    }
    catch (error) {
        console.error("❌ Server failed to start");
        console.error(error);
        process.exit(1);
    }
}

startServer();