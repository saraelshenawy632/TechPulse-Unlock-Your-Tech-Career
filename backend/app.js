const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();


// ====================================
// ROUTES
// ====================================

const authRoutes =
    require("./routes/authRoute");

const jobsRoutes =
    require("./routes/jobs");

const companiesRoutes =
    require("./routes/companies");

const locationsRoutes =
    require("./routes/locations");

const analyticsRoutes =
    require("./routes/analyticsRoutes");

const statsRoutes =
    require("./routes/statsRoutes");

const skillsRoutes =
    require("./routes/skills");

const applicationRoutes =
    require("./routes/applications");

const adminRoutes =
    require("./routes/admin");

const usersRoutes =
    require("./routes/users");


// ====================================
// MIDDLEWARES
// ====================================

app.use(

    cors({

        origin:
            "http://localhost:5173",

        credentials:
            true

    })

);


app.use(
    express.json()
);


app.use(

    express.urlencoded({

        extended:
            true

    })

);


// ====================================
// API ROUTES
// ====================================


// AUTH

app.use(

    "/api/auth",

    authRoutes

);


// JOBS

app.use(

    "/api/jobs",

    jobsRoutes

);


// COMPANIES

app.use(

    "/api/companies",

    companiesRoutes

);


// LOCATIONS

app.use(

    "/api/locations",

    locationsRoutes

);


// GENERAL STATS

app.use(

    "/api/stats",

    statsRoutes

);


// =====================================================
// ANALYTICS
//
// GET
// /api/admin/analytics
//
// GET
// /api/admin/analytics/jobs
//
// GET
// /api/admin/analytics/locations
// =====================================================

app.use(

    "/api/admin/analytics",

    analyticsRoutes

);


// TRENDING SKILLS

app.use(

    "/api/trending-skills",

    skillsRoutes

);


// APPLICATIONS

app.use(

    "/api",

    applicationRoutes

);


// =====================================================
// ADMIN
//
// Dashboard
// Jobs
// Applications
// Users
// =====================================================

app.use(

    "/api/admin",

    adminRoutes

);


// USERS

app.use(

    "/api/users",

    usersRoutes

);


// ====================================
// ROOT
// ====================================

app.get(

    "/",

    (req, res) => {

        res.status(200).json({

            success:
                true,

            message:
                "🚀 TechPulse Egypt API Running Successfully"

        });

    }

);


// ====================================
// 404
// ====================================

app.use(

    (req, res) => {

        res.status(404).json({

            success:
                false,

            message:

                `Cannot ${req.method} ${req.originalUrl}`

        });

    }

);


// ====================================
// ERROR HANDLER
// ====================================

app.use(

    (err, req, res, next) => {

        console.error(
            "Global Error:",
            err
        );


        res

            .status(
                err.status || 500
            )

            .json({

                success:
                    false,

                message:

                    err.message ||

                    "Internal Server Error"

            });

    }

);


// ====================================
// START SERVER
// ====================================

const PORT =

    process.env.PORT ||

    5000;


async function startServer() {

    try {


        await connectDB();


        app.listen(

            PORT,

            () => {

                console.log(
                    "========================================"
                );


                console.log(
                    "✅ SQL Server Connected Successfully"
                );


                console.log(

                    `🚀 Server Running on http://localhost:${PORT}`

                );


                console.log(

                    `📊 Analytics API: http://localhost:${PORT}/api/admin/analytics`

                );


                console.log(
                    "========================================"
                );

            }

        );

    }

    catch (err) {


        console.error(

            "❌ Failed to start server"

        );


        console.error(
            err
        );


        process.exit(
            1
        );

    }

}


startServer();