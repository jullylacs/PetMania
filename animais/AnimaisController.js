const express = require('express');
const router = express.Router();
const Animais = require('./Animais');
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');

// Lista pública de animais
router.get('/animais', async (req, res) => {
  try {
    const animais = await Animais.findAll();
    res.render('animais', { animais });
  } catch (err) {
    console.error('Erro ao listar animais:', err);
    res.render('animais', { animais: [] });
  }
});

// Formulário criar (admin)
router.get('/admin/animais/new', ensureAdmin, (req, res) => {
  res.render('admin/animais/new');
});

// Salvar animal (admin)
router.post('/animais/save', ensureAdmin, async (req, res) => {
  const { nome, descricao, imagem } = req.body;
  if (!nome || !descricao) return res.redirect('/admin/animais/new');

  try {
    await Animais.create({ nome, descricao, imagem: imagem || '' });
    res.redirect('/admin/animais');
  } catch (err) {
    console.error('Erro ao salvar animal:', err);
    res.redirect('/admin/animais/new');
  }
});

// Lista admin
router.get('/admin/animais', ensureAdmin, async (req, res) => {
  try {
    const animais = await Animais.findAll();
    res.render('admin/animais/index', { animais });
  } catch (err) {
    console.error('Erro ao carregar admin/animais:', err);
    res.redirect('/');
  }
});

// Edit form
router.get('/admin/animais/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const animal = await Animais.findByPk(req.params.id);
    if (!animal) return res.redirect('/admin/animais');
    res.render('admin/animais/edit', { animal });
  } catch (err) {
    console.error('Erro ao buscar animal:', err);
    res.redirect('/admin/animais');
  }
});

// Update
router.post('/animais/update', ensureAdmin, async (req, res) => {
  const { id, nome, descricao, imagem } = req.body;
  if (!id || !nome || !descricao) return res.redirect('/admin/animais');

  try {
    await Animais.update({ nome, descricao, imagem: imagem || '' }, { where: { id } });
    res.redirect('/admin/animais');
  } catch (err) {
    console.error('Erro ao atualizar animal:', err);
    res.redirect('/admin/animais');
  }
});

// Delete
router.post('/animais/delete', ensureAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.redirect('/admin/animais');

  try {
    await Animais.destroy({ where: { id } });
    res.redirect('/admin/animais');
  } catch (err) {
    console.error('Erro ao deletar animal:', err);
    res.redirect('/admin/animais');
  }
});

module.exports = router;
