const userService = require("../services/userService");

async function getUsers(req, res) {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (req.user.id === id) {
            return res.status(400).json({ message: "You cannot delete your own account." });
        }
        await userService.deleteUser(id);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateRole(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { role } = req.body;

        if (!["Admin", "User"].includes(role)) {
            return res.status(400).json({ message: "Invalid Role" });
        }

        if (req.user.id === id) {
            return res.status(400).json({ message: "You cannot change your own role." });
        }

        await userService.updateRole(id, role);
        res.json({ success: true, message: "Role Updated Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getUsers,
    deleteUser,
    updateRole
};