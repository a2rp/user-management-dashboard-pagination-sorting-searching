const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const { v4: uuidv4 } = require('uuid');

const login = (req, res, next) => {
    // console.log(req.body, "req.body");
    if (!req.body.email || !req.body.password) {
        return res.json({
            success: false,
            message: "All parameters required"
        });
    }

    UserModel.findOne({ email: req.body.email }).then(async user => {
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        // console.log(comparePassword);
        if (!comparePassword) {
            return res.json({
                success: false,
                message: "Password mismatch"
            });
        }

        res.json({
            success: true,
            userid: user.userid,
            name: user.name,
            email: user.email,
            role: user.role
        });
    }).catch(error => {
        res.json({
            success: false,
            message: error.message
        });
    });
};

const allUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find({}).select({ "userid": 1, "name": 1, "email": 1, "role": 1, "_id": 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneUser = async (req, res, next) => {
    try {
        const user = await UserModel.find({ email: req.body.email });
        // console.log(user);
        const userData = {
            success: true,
            userid: user[0].userid,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role
        };
        // console.log(userData);
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addUser = async (req, res, next) => {
    try {
        const { name, email, password, password_confirm, role } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.json({ message: `${email} already exists` });
        }

        if (password.trim() !== password_confirm.trim()) {
            return res.json({ message: `passwords do not match` });
        }

        const userid = "user" + (uuidv4().substring(0, 6));
        const newUser = new UserModel({ userid, name, email, password, role });
        await newUser.save();
        res.json({
            success: true,
            message: "user added successfully"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const filter = { email: req.body.email };
        const update = { name: req.body.name, role: req.body.role };
        let updatedUser = await UserModel.findOneAndUpdate(filter, update);
        updatedUser = await UserModel.findOne(filter);
        res.json({
            success: true,
            userid: updatedUser.userid,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteOneUser = async (req, res) => {
    console.log(req.params);
    try {
        const deleted = await UserModel.findOneAndRemove({ email: req.params.email });
        console.log(deleted);
        if (deleted == null) {
            res.status(400).send({
                success: false,
                message: req.params.email + ' was not found'
            });
        } else {
            res.status(200).send({
                success: true,
                message: "user deleted"
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    login,
    allUsers,
    getOneUser,
    addUser,
    updateUser,
    deleteOneUser,
};

