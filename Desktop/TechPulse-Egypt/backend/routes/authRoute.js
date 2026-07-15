const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const { getPool, sql } = require("../config/db");

const router = express.Router();


// =========================================
// JWT Middleware
// =========================================

const authMiddleware = (req, res, next) => {

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch {

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};


// =========================================
// Register
// =========================================

router.post(

    "/register",

    [

        check("name", "Name is required").notEmpty(),

        check("email", "Invalid Email").isEmail(),

        check("password", "Password must be at least 6 characters")
            .isLength({ min: 6 })

    ],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                errors: errors.array()
            });

        }

        const {
            name,
            email,
            password
        } = req.body;

        try {

            const pool = getPool();

            // Check Email

            const exist = await pool.request()

                .input("email", sql.NVarChar(255), email)

                .query(`
                    SELECT Id
                    FROM Users
                    WHERE Email=@email
                `);

            if (exist.recordset.length > 0) {

                return res.status(400).json({

                    message: "Email already exists"

                });

            }

            // Hash Password

            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert User

            const inserted = await pool.request()

                .input("name", sql.NVarChar(100), name)

                .input("email", sql.NVarChar(255), email)

                .input("password", sql.NVarChar(255), hashedPassword)

                .query(`

                    INSERT INTO Users
                    (
                        Name,
                        Email,
                        Password
                    )

                    OUTPUT
                        INSERTED.Id,
                        INSERTED.Name,
                        INSERTED.Email,
                        INSERTED.Role

                    VALUES
                    (
                        @name,
                        @email,
                        @password
                    )

                `);

            const user = inserted.recordset[0];

            const token = jwt.sign(

                {

                    id: user.Id,

                    role: user.Role

                },

                process.env.JWT_SECRET,

                {

                    expiresIn: "7d"

                }

            );

            res.status(201).json({

                token,

                user: {

                    id: user.Id,

                    name: user.Name,

                    email: user.Email,

                    role: user.Role

                }

            });

        }

        catch (err) {

            console.log(err);

            res.status(500).json({

                message: err.message

            });

        }

    }

);


// =========================================
// Login
// =========================================

router.post(

    "/login",

    [

        check("email").isEmail(),

        check("password").notEmpty()

    ],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                errors: errors.array()

            });

        }

        const {

            email,

            password

        } = req.body;

        try {

            const pool = getPool();

            const result = await pool.request()

                .input("email", sql.NVarChar(255), email)

                .query(`

                    SELECT *

                    FROM Users

                    WHERE Email=@email

                `);

            if (result.recordset.length === 0) {

                return res.status(400).json({

                    message: "Invalid Email or Password"

                });

            }

            const user = result.recordset[0];

            const match = await bcrypt.compare(

                password,

                user.Password

            );

            if (!match) {

                return res.status(400).json({

                    message: "Invalid Email or Password"

                });

            }

            const token = jwt.sign(

                {

                    id: user.Id,

                    role: user.Role

                },

                process.env.JWT_SECRET,

                {

                    expiresIn: "7d"

                }

            );

            res.json({

                token,

                user: {

                    id: user.Id,

                    name: user.Name,

                    email: user.Email,

                    role: user.Role

                }

            });

        }

        catch (err) {

            console.log(err);

            res.status(500).json({

                message: err.message

            });

        }

    }

);


// =========================================
// Current User
// =========================================

router.get(

    "/me",

    authMiddleware,

    async (req, res) => {

        try {

            const pool = getPool();

            const result = await pool.request()

                .input("id", sql.Int, req.user.id)

                .query(`

                    SELECT

                        Id,

                        Name,

                        Email,

                        Role,

                        CreatedAt

                    FROM Users

                    WHERE Id=@id

                `);

            if (result.recordset.length === 0) {

                return res.status(404).json({

                    message: "User not found"

                });

            }

            res.json(result.recordset[0]);

        }

        catch (err) {

            console.log(err);

            res.status(500).json({

                message: err.message

            });

        }

    }

);

module.exports = router;