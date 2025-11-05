const express = require('express');
const router = express.Router();
const Cadastro = require('./Cadastro'); // modelo Sequelize
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');

/**
 * ===============================
 *        ÁREA ADMINISTRATIVA
 * ===============================
 */

// Formulário de novo cadastro (admin)
router.get('/admin/cadastros/new', ensureAdmin, (req, res) => {
    res.render('admin/usuario_cadastro/new');
});

// Listar todos os cadastros (admin)
router.get('/admin/cadastros', ensureAdmin, async (req, res) => {
    try {
        const cadastros = await Cadastro.findAll({ order: [['id', 'DESC']] });
        res.render('admin/usuario_cadastro/index', { cadastros });
    } catch (err) {
        console.error('Erro ao buscar cadastros:', err);
        res.redirect('/');
    }
});

// Editar cadastro (formulário)
router.get('/admin/cadastros/editar/:id', ensureAdmin, async (req, res) => {
    try {
        const cadastro = await Cadastro.findByPk(req.params.id);
        if (!cadastro) return res.redirect('/admin/cadastros');
        res.render('admin/usuario_cadastro/edit', { cadastro });
    } catch (err) {
        console.error('Erro ao buscar cadastro para edição:', err);
        res.redirect('/admin/cadastros');
    }
});

// Atualizar cadastro (admin)
router.post('/cadastros/update', ensureAdmin, async (req, res) => {
    const { id, nome, email, senha } = req.body;
    if (!id || !nome || !email) return res.redirect('/admin/cadastros');

    try {
        const updateData = { nome, email };
        if (senha && senha.trim() !== '') {
            updateData.senha = await bcrypt.hash(senha, 10);
        }
        await Cadastro.update(updateData, { where: { id } });
        res.redirect('/admin/cadastros');
    } catch (err) {
        console.error('Erro ao atualizar cadastro:', err);
        res.redirect('/admin/cadastros');
    }
});

// Deletar cadastro
router.post('/cadastros/delete', ensureAdmin, async (req, res) => {
    const { id } = req.body;
    if (!id || isNaN(id)) return res.redirect('/admin/cadastros');

    try {
        await Cadastro.destroy({ where: { id } });
        res.redirect('/admin/cadastros');
    } catch (err) {
        console.error('Erro ao deletar cadastro:', err);
        res.redirect('/admin/cadastros');
    }
});


/**
 * ===============================
 *           ÁREA PÚBLICA
 * ===============================
 */

// Formulário público de cadastro (usuário comum)
router.get('/cadastro', (req, res) => {
    // view separada, por exemplo: "views/cadastro/cadastro.ejs"
    res.render('cadastro/cadastro');
});

// Salvar cadastro público
router.post('/cadastros/save', async (req, res) => {
    const { nome, email, senha } = req.body;

    // validação simples
    if (!nome || !email || !senha) {
        console.error('Campos obrigatórios faltando.');
        return res.redirect('/cadastro');
    }

    try {
        // Verifica se o e-mail já existe
        const existente = await Cadastro.findOne({ where: { email } });
        if (existente) {
            console.error('E-mail já cadastrado.');
            return res.redirect('/cadastro');
        }

        // Cria o novo usuário com senha criptografada
        const hashed = await bcrypt.hash(senha, 10);
        await Cadastro.create({ nome, email, senha: hashed });

        console.log('Usuário cadastrado com sucesso!');
        return res.redirect('/login');
    } catch (err) {
        console.error('Erro ao salvar cadastro:', err);
        res.redirect('/cadastro');
    }
});

module.exports = router;
