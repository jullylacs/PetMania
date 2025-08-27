const express = require("express");
const router = express.Router();
const Cadastro = require("./Cadastro");


// Rota para formulário de nova categoria
router.get("/admin/cadastros/newAdm", (req, res) => {
    res.render("admin/cadastros/newAdmn");
});
router.get("/admin/cadastros/indexAdm", (req, res) => {
    res.render("admin/cadastros/indexAdm");
});

// Rota para salvar categoria
router.post("/cadastros/save", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const DiaVisita = req.body.DiaVisita;
    const Hora = req.body.Hora;
    const Pet = req.body.Pet;

    console.log("Cadastro recebido:", nome, email);

    if (nome != undefined && nome.trim() !== "", 
    email != undefined && email.trim() !== "", 
    DiaVisita != undefined && DiaVisita.trim() !== "",
    Hora != undefined && Hora.trim() !== "",
    Pet != undefined && Pet.trim() !== "") {
        Cadastro.create({
            nome: nome,
            email: email,
            DiaVisita: DiaVisita,
            Hora: Hora,
            Pet: Pet,

        }).then(cadastro => {
            console.log("Categoria salva:", cadastro);
            res.redirect("/admin/cadastros");
        }).catch(err => {
            console.error("Erro ao salvar categoria:", err);
            res.redirect("/admin/cadastros/novo");
        });
    } else {
        res.redirect("/admin/cadastros/novo");
    }
});

// Rota para listagem de cadasros
router.get("/admin/cadastros", (req, res) => {
    Cadastro.findAll().then(cadastros => {
        console.log("Cadastros encontrados", cadastros);
        res.render("admin/cadastros/index", { cadastros });
    }).catch(err => {
        console.error("Erro ao buscar cadastros:", err);
        res.redirect("/");

    });
});

// Rota para deletar um cadastro
router.post("/cadastros/delete", (req, res) => {
    const id = req.body.id;

    if (id != undefined && !isNaN(id)) {
        Cadastro.destroy({
            where: { id: id }
        }).then(() => {
            console.log("Cadastro deletado, ID:", id);
            res.redirect("/admin/cadastros");
        }).catch(err => {
            console.error("Erro ao deletar cadastro:", err);
            res.redirect("/admin/cadastros");
        });
    } else {
        res.redirect("/admin/cadastros");
    }
});


//acesso de ususarios
router.post("/cadastros/save", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const DiaVisita = req.body.DiaVisita;
    const Hora = req.body.Hora;
    const Pet = req.body.Pet;

    console.log("Cadastro recebido:", nome, email);

    if (nome != undefined && nome.trim() !== "", 
	nome != undefined && nome.trim() !== "",
    email != undefined && email.trim() !== "", 
    DiaVisita != undefined && DiaVisita.trim() !== "",
    Hora != undefined && Hora.trim() !== "",
    Pet != undefined && Pet.trim() !== "") {
        Cadastro.create({
            nome: nome,
            email: email,
            DiaVisita: DiaVisita,
            Hora: Hora,
            Pet: Pet,

        }).then(cadastro => {
            console.log("Categoria salva:", cadastro);
            res.redirect("/admin/cadastros");
        }).catch(err => {
            console.error("Erro ao salvar categoria:", err);
            res.redirect("/admin/cadastros/novo");
        });
    } else {
        res.redirect("/admin/cadastros/novo");
    }
});

module.exports = router;