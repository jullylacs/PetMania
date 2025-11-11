const express = require('express');
const router = express.Router();
// Ajuste o caminho do model conforme sua estrutura de pastas:
const Animal = require('../models/Animal');
const mongoose = require('mongoose');

// Novo: middleware para validar ObjectId
function validateId(req, res, next) {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: 'ID inválido' });
	}
	return next();
}

// GET /animais - listar todos
router.get('/', async (req, res) => {
	try {
		const animais = await Animal.find();
		return res.status(200).json(animais);
	} catch (err) {
		return res.status(500).json({ error: 'Erro no servidor' });
	}
});

// GET /animais/:id - obter por id
router.get('/:id', validateId, async (req, res) => {
	const { id } = req.params;
	try {
		const animal = await Animal.findById(id);
		if (!animal) return res.status(404).json({ error: 'Animal não encontrado' });
		return res.status(200).json(animal);
	} catch (err) {
		return res.status(500).json({ error: 'Erro no servidor' });
	}
});

// POST /animais - criar novo
router.post('/', async (req, res) => {
	try {
		const novo = await Animal.create(req.body);
		return res.status(201).json(novo);
	} catch (err) {
		return res.status(400).json({ error: 'Dados inválidos' });
	}
});

// PUT /animais/:id - atualizar
router.put('/:id', validateId, async (req, res) => {
	const { id } = req.params;
	try {
		const atualizado = await Animal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
		if (!atualizado) return res.status(404).json({ error: 'Animal não encontrado' });
		return res.status(200).json(atualizado);
	} catch (err) {
		return res.status(400).json({ error: 'Falha ao atualizar' });
	}
});

// DELETE /animais/:id - remover
router.delete('/:id', validateId, async (req, res) => {
	const { id } = req.params;
	try {
		const removido = await Animal.findByIdAndDelete(id);
		if (!removido) return res.status(404).json({ error: 'Animal não encontrado' });
		return res.status(200).json({ message: 'Removido com sucesso' });
	} catch (err) {
		return res.status(500).json({ error: 'Erro no servidor' });
	}
});

// POST /animais/:id/delete - compatibilidade com botão/formulário que usa POST
router.post('/:id/delete', validateId, async (req, res) => {
	const { id } = req.params;
	try {
		const removido = await Animal.findByIdAndDelete(id);
		if (!removido) {
			if (req.accepts('html')) return res.redirect('/animais?error=not_found');
			return res.status(404).json({ error: 'Animal não encontrado' });
		}
		// Se vier de um formulário HTML, redireciona para a lista
		if (req.accepts('html')) return res.redirect('/animais?msg=removido');
		return res.status(200).json({ message: 'Removido com sucesso' });
	} catch (err) {
		if (req.accepts('html')) return res.redirect('/animais?error=server');
		return res.status(500).json({ error: 'Erro no servidor' });
	}
});

// POST /animais/:id/update - compatibilidade com botão/formulário que usa POST
router.post('/:id/update', validateId, async (req, res) => {
	const { id } = req.params;
	try {
		// req.body deve conter os campos do formulário (ex.: nome, especie, idade, ...)
		const atualizado = await Animal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
		if (!atualizado) {
			if (req.accepts('html')) return res.redirect('/animais?error=not_found');
			return res.status(404).json({ error: 'Animal não encontrado' });
		}
		if (req.accepts('html')) return res.redirect('/animais?msg=atualizado');
		return res.status(200).json(atualizado);
	} catch (err) {
		if (req.accepts('html')) return res.redirect('/animais?error=update_failed');
		return res.status(400).json({ error: 'Falha ao atualizar' });
	}
});

module.exports = router;