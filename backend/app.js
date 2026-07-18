const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();


// ====================================
// Routes
// ====================================

const authRoutes = require("./routes/authRoute");
const jobsRoutes = require("./routes/jobs");
const companiesRoutes = require("./routes/companies");
const locationsRoutes = require("./routes/locations");
const analyticsRoutes = require("./routes/analyticsRoutes");
const statsRoutes = require("./routes/statsRoutes");
const skillsRoutes = require("./routes/skills");
const applicationRoutes = require("./routes/applications");
const adminRoutes = require("./routes/admin");
const usersRoutes = require("./routes/users");



// ====================================
// Middlewares
// ====================================

app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
);


app.use(express.json());

app.use(
    express.urlencoded({
        extended:true
    })
);




// ====================================
// API Routes
// ====================================


app.use(
"/api/auth",
authRoutes
);



app.use(
"/api/jobs",
jobsRoutes
);



app.use(
"/api/companies",
companiesRoutes
);



app.use(
"/api/locations",
locationsRoutes
);



app.use(
"/api/stats",
statsRoutes
);



app.use(
"/api/analytics",
analyticsRoutes
);



app.use(
"/api/trending-skills",
skillsRoutes
);



app.use(
"/api",
applicationRoutes
);



// Admin
// هنا كل حاجة:
// dashboard
// jobs
// applications
// users

app.use(
"/api/admin",
adminRoutes
);



app.use(
"/api/users",
usersRoutes
);





app.get("/",(req,res)=>{

    res.status(200).json({

        success:true,

        message:
        "🚀 TechPulse Egypt API Running Successfully"

    });

});





// ====================================
// 404
// ====================================

app.use((req,res)=>{

    res.status(404).json({

        success:false,

        message:
        `Cannot ${req.method} ${req.originalUrl}`

    });

});





// ====================================
// Error Handler
// ====================================


app.use((err,req,res,next)=>{


    console.error(err);


    res.status(err.status || 500)
    .json({

        success:false,

        message:
        err.message || "Internal Server Error"

    });


});





// ====================================
// Start
// ====================================


const PORT =
process.env.PORT || 5000;



async function startServer(){


    try{


        await connectDB();



        app.listen(PORT,()=>{


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
            "========================================"
            );


        });



    }

    catch(err){


        console.error(
            "❌ Failed to start server"
        );


        console.error(err);


        process.exit(1);


    }


}



startServer();