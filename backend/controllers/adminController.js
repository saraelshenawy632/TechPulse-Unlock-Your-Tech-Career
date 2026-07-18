const adminService = require("../services/adminService");

async function dashboard(req, res) {

    try {

        const data = await adminService.dashboard();

        res.json(data);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

}

module.exports = {

    dashboard

};