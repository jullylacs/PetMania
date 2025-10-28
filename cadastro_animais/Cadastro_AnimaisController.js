// Rota para salvar categoria
// Rota para listagem de cadasros
// Rota para deletar um cadastro
//acesso de ususarios
const express = require("express");
const router = express.Router();
const Agendamento = require("./Cadastro_Animais");
const Animais = require("../animais/Animais");
const { ensureAdmin } = require("../config/auth");

// Admin: Listar agendamentos
router.get("/admin/agendamentos", ensureAdmin, async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            include: [{ model: Animais }],
            order: [['data', 'ASC'], ['hora', 'ASC']]
        });
        res.render("admin/agendamento/index", { agendamentos });
    } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        req.flash('error', 'Erro ao carregar agendamentos');
        res.redirect('/admin');
    }
});

// Admin: Form novo
router.get("/admin/agendamentos/new", ensureAdmin, async (req, res) => {
    try {
        const pets = await Animais.findAll({ where: { status: 'disponivel' } });
        res.render("admin/agendamento/new", { pets });
    } catch (err) {
        console.error('Erro ao carregar form novo:', err);
        req.flash('error', 'Erro ao carregar formulário');
        res.redirect('/admin/agendamentos');
    }
});

// Salvar
router.post("/agendamentos/save", ensureAdmin, async (req, res) => {
    const { userId, petId, data, hora } = req.body;
    if (!userId || !petId || !data || !hora) {
        req.flash('error', 'Todos os campos são obrigatórios');
        return res.redirect('/admin/agendamentos/new');
    }

    try {
        await Agendamento.create({ userId, petId, data, hora });
        req.flash('success', 'Agendamento criado com sucesso');
        res.redirect('/admin/agendamentos');
    } catch (err) {
        console.error('Erro ao salvar agendamento:', err);
        req.flash('error', 'Erro ao salvar agendamento');
        res.redirect('/admin/agendamentos/new');
    }
});

// Form editar
router.get('/admin/agendamentos/edit/:id', ensureAdmin, async (req, res) => {
    try {
        const [agendamento, pets] = await Promise.all([
            Agendamento.findByPk(req.params.id, { include: [{ model: Animais }] }),
            Animais.findAll({ where: { status: 'disponivel' } })
        ]);
        
        if (!agendamento) {
            req.flash('error', 'Agendamento não encontrado');
            return res.redirect('/admin/agendamentos');
        }
        
        res.render('admin/agendamento/edit', { agendamento, pets });
    } catch (err) {
        console.error('Erro ao carregar edição:', err);
        req.flash('error', 'Erro ao carregar formulário');
        res.redirect('/admin/agendamentos');
    }
});

// Atualizar
router.post('/agendamentos/update', ensureAdmin, async (req, res) => {
    const { id, userId, petId, data, hora, status } = req.body;
    if (!id || !userId || !petId || !data || !hora) {
        req.flash('error', 'Todos os campos são obrigatórios');
        return res.redirect('/admin/agendamentos');
    }

    try {
        await Agendamento.update(
            { userId, petId, data, hora, status },
            { where: { id } }
        );
        req.flash('success', 'Agendamento atualizado com sucesso');
        res.redirect('/admin/agendamentos');
    } catch (err) {
        console.error('Erro ao atualizar agendamento:', err);
        req.flash('error', 'Erro ao atualizar agendamento');
        res.redirect('/admin/agendamentos');
    }
});

// Deletar
router.post('/agendamentos/delete', ensureAdmin, async (req, res) => {
    const { id } = req.body;
    if (!id) {
        req.flash('error', 'ID do agendamento não fornecido');
        return res.redirect('/admin/agendamentos');
    }

    try {
        await Agendamento.destroy({ where: { id } });
        req.flash('success', 'Agendamento removido com sucesso');
        res.redirect('/admin/agendamentos');
    } catch (err) {
        console.error('Erro ao deletar agendamento:', err);
        req.flash('error', 'Erro ao remover agendamento');
        res.redirect('/admin/agendamentos');
    }
});

module.exports = router;