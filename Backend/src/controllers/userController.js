const userService = require("../services/userService");

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.send(users);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const register = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.send({ message: "register success", data: user });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const login = async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.email, req.body.password);
        res.send({ message: "login success", data: user });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const update = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.send({ message: "update success", data: user });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const remove = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.send({ message: "deleted" });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = {
    getUsers,
    getUser,
    register,
    login,
    update,
    remove
};