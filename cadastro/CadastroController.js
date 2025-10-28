const express = require('express');
const router = express.Router();
const Cadastro = require('./Cadastro');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');

// Formulário de cadastro (admin)
router.get('/admin/cadastros/new', ensureAdmin, (req, res) => {
    res.render('admin/usuario_cadastro/new');
});

// Listar cadastros (admin)
router.get('/admin/cadastros', ensureAdmin, async (req, res) => {
    try {
        const cadastros = await Cadastro.findAll();
        res.render('admin/usuario_cadastro/index', { cadastros });
    } catch (err) {
        console.error('Erro ao buscar cadastros:', err);
        res.redirect('/');
    }
});

// Formulário público de cadastro
router.get('/cadastro', (req, res) => {
    res.render('admin/usuario_cadastro/new');
});

// Salvar cadastro (admin ou público) com hashing de senha
router.post('/cadastros/save', async (req, res) => {
    const { nome, email, senha } = req.body;
    const referer = req.get('referer') || '';

    if (!nome || !email || !senha) {
        return res.redirect(referer.includes('/admin') ? '/admin/cadastros/new' : '/');
    }

    try {
        const hashed = await bcrypt.hash(senha, 10);
        await Cadastro.create({ nome, email, senha: hashed });
        return res.redirect(referer.includes('/admin') ? '/admin/cadastros' : '/');
    } catch (err) {
        console.error('Erro ao salvar cadastro:', err);
        return res.redirect(referer.includes('/admin') ? '/admin/cadastros/new' : '/');
    }
});

// Editar cadastro (form)
router.get('/admin/cadastros/editar/:id', ensureAdmin, async (req, res) => {
    try {
        const cadastro = await Cadastro.findByPk(req.params.id);
        if (!cadastro) return res.redirect('/admin/cadastros');
        res.render('admin/usuario_cadastro/edit', { cadastro });
    } catch (err) {
        console.error('Erro ao buscar cadastro para editar:', err);
        res.redirect('/admin/cadastros');
    }
});

// Atualizar cadastro
router.post('/cadastros/update', async (req, res) => {
    const { id, nome, email, senha } = req.body;
    if (!id || !nome || !email) return res.redirect('/admin/cadastros');

    try {
        const updateData = { nome, email };
        if (senha && senha.trim() !== '') updateData.senha = await bcrypt.hash(senha, 10);
        await Cadastro.update(updateData, { where: { id } });
        res.redirect('/admin/cadastros');
    } catch (err) {
        console.error('Erro ao atualizar cadastro:', err);
        res.redirect('/admin/cadastros');
    }
});

// Deletar cadastro
router.post('/cadastros/delete', async (req, res) => {
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

module.exports = router;
