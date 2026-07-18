const service = require("../services/applicationService");





exports.getApplications = async(req,res)=>{


    try{


        const data = await service.getApplications();


        res.json(data);



    }catch(error){


        res.status(500)
        .json({
            message:error.message
        });


    }

};







exports.updateStatus = async(req,res)=>{


    try{


        const {status}=req.body;


        await service.updateStatus(
            req.params.id,
            status
        );


        res.json({

            message:"Status Updated Successfully"

        });



    }catch(error){


        res.status(500)
        .json({

            message:error.message

        });


    }


};









exports.deleteApplication = async(req,res)=>{


    try{


        await service.deleteApplication(
            req.params.id
        );


        res.json({

            message:"Application Deleted"

        });



    }catch(error){


        res.status(500)
        .json({

            message:error.message

        });


    }


};
const applicationService =
require("../services/applicationService");



// GET ALL

async function getApplications(req,res){

    try{

        const data =
        await applicationService.getApplications();


        res.json(data);

    }

    catch(err){

        res.status(500).json({
            message:err.message
        });

    }

}





// GET ONE

async function getApplicationById(req,res){

    try{


        const application =
        await applicationService.getApplicationById(
            req.params.id
        );


        res.json({

            success:true,

            application

        });


    }

    catch(err){


        res.status(500).json({

            message:err.message

        });


    }

}





// UPDATE STATUS

async function updateStatus(req,res){

    try{


        await applicationService.updateStatus(

            req.params.id,

            req.body.status

        );


        res.json({

            success:true

        });



    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

}




// DELETE

async function deleteApplication(req,res){

    try{


        await applicationService.deleteApplication(
            req.params.id
        );


        res.json({

            success:true

        });



    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

}



module.exports={

    getApplications,

    getApplicationById,

    updateStatus,

    deleteApplication

};