const repository = require("../repositories/userRepository");

async function getUsers() {
    return await repository.getAllUsers();
}

async function deleteUser(id) {
    return await repository.deleteUser(id);
}

async function updateRole(id, role) {
    return await repository.updateRole(id, role);
}

module.exports = {
    getUsers,
    deleteUser,
    updateRole
};