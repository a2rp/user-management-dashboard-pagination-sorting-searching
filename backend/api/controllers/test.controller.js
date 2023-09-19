const express = require("express");

const a2rp = (req, res, next) => {
    res.status(200).json({
        message: "a2rp: an Ashish Ranjan presentation"
    });
};

module.exports = {
    a2rp
};

