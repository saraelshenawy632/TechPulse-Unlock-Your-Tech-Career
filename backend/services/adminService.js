const repository = require("../repositories/adminRepository");

async function dashboard() {

    return await repository.getDashboardStats();

}

module.exports = {

    dashboard

};