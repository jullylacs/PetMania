const express = require('express');
const router = express.Router();
// Ajuste o require abaixo para o caminho real do seu model
const Animal = require('../models/Animal');

// GET /animais - listar todos
router.get('/', async (req, res) => {
	try {
		const animais = await Animal.find();
		return res.json(animais);
	} catch (err) {
		return res.status(500).json({ error: 'Erro no servidor' });
	}
});

// GET /animais/:id - obter por id
router.get('/:id', async (req, res) => {
	const { id } = req.params;
	if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ error: 'ID inválido' });
	try {
		const animal = await Animal.findById(id);
		if (!animal) return res.status(404).json({ error: 'Animal não encontrado' });
		return res.json(animal);
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
		return res.status(400).json({ error: 'Dados inválidos', details: err.message });
	}
});

// PUT /animais/:id - atualizar
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ error: 'ID inválido' });
	try {
		const atualizado = await Animal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
		if (!atualizado) return res.status(404).json({ error: 'Animal não encontrado' });
		return res.json(atualizado);
	} catch (err) {
		return res.status(400).json({ error: 'Falha ao atualizar', details: err.message });
	}
});

// DELETE /animais/:id - remover
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ error: 'ID inválido' });
	try {
		const removido = await Animal.findByIdAndDelete(id);
		if (!removido) return res.status(404).json({ error: 'Animal não encontrado' });
		return res.json({ message: 'Removido com sucesso' });
	} catch (err) {
		return res.status(500).json({ error: 'Erro no servidor' });
	}
});

module.exports = router;