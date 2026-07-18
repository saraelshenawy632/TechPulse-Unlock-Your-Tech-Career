const repository = require("../repositories/jobRepository");

// ==========================
// Add Job
// ==========================

async function addJob(job) {

    return await repository.addJob(job);

}

// ==========================
// Delete Job
// ==========================

async function deleteJob(id) {

    return await repository.deleteJob(id);

}
async function updateJob(id, job) {

    return await repository.updateJob(id, job);

}

module.exports = {

    addJob,

    updateJob,

    deleteJob

};