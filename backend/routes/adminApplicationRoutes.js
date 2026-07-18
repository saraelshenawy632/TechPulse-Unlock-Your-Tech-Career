const express = require("express");

const router = express.Router();


const controller = require("../controllers/applicationController");




// GET ALL

router.get(
"/applications",
controller.getApplications
);



// UPDATE STATUS

router.put(
"/applications/:id",
controller.updateStatus
);



// DELETE

router.delete(
"/applications/:id",
controller.deleteApplication
);



module.exports = router;