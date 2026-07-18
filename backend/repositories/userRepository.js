const { getPool, sql } = require("../config/db");

async function getAllUsers() {
    const pool = getPool();
    const result = await pool.request().query(`
        SELECT Id, Name, Email, Role, CreatedAt
        FROM Users
        ORDER BY CreatedAt DESC
    `);
    return result.recordset;
}

async function deleteUser(id) {
    const pool = getPool();
    await pool.request()
        .input("id", sql.Int, id)
        .query(`DELETE FROM Users WHERE Id=@id`);
}

async function updateRole(id, role) {
    const pool = getPool();
    await pool.request()
        .input("id", sql.Int, id)
        .input("role", sql.NVarChar(20), role)
        .query(`UPDATE Users SET Role=@role WHERE Id=@id`);
}

module.exports = {
    getAllUsers,
    deleteUser,
    updateRole
};