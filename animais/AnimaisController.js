const express = require("express");
const router = express.Router();
const Animais = require("./Animais");

// Rota para formulário de nova categoria
router.get("/admin/cadastros/newAdm", (req, res) => {
    res.render("admin/cadastros/newAdmn");
});
router.get("/admin/cadastros/indexAdm", (req, res) => {
    res.render("admin/cadastros/indexAdm");
});