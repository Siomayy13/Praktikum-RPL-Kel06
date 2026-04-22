const userService = require("../services/userService");
const supabase = require("../config/supabase");

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

const updatePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        // 🔥 1. ambil user lama
        const oldUser = await userService.getUserById(Number(req.params.id));

        // 🔥 2. hapus foto lama (kalau ada)
        if (oldUser.photo) {
            const oldPath = oldUser.photo.split("/profiles/")[1];

            if (oldPath) {
                await supabase.storage
                    .from("profiles")
                    .remove([oldPath]);
            }
        }

        // 🔥 3. upload foto baru
        const file = req.file;

        const cleanName = file.originalname.replace(/\s+/g, "_");
        const fileName = Date.now() + "-" + cleanName;

        const { error } = await supabase.storage
            .from("profiles")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from("profiles")
            .getPublicUrl(fileName);

        const photoUrl = data.publicUrl;

        // 🔥 4. update database
        const user = await userService.updateUser(
            Number(req.params.id),
            { photo: photoUrl }
        );

        res.send({
            message: "photo updated",
            data: user
        });

    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
};

module.exports = {
    getUsers,
    getUser,
    register,
    login,
    update,
    remove,
    updatePhoto
};