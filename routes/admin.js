const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');
const Donation = require('../models/Donation');
const User = require('../models/User');

// Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const [
            pets,
            adoptions,
            donations,
            users
        ] = await Promise.all([
            Pet.findAll(),
            Adoption.findAll(),
            Donation.findAll(),
            User.findAll()
        ]);

        res.render('admin/dashboard', {
            pets,
            adoptions,
            donations,
            users
        });
    } catch (error) {
        req.flash('error', 'Erro ao carregar dashboard');
        res.redirect('/');
    }
});

// Pet Management
router.get('/pets/new', isAdmin, (req, res) => {
    res.render('admin/pets/new');
});

router.post('/pets', isAdmin, async (req, res) => {
    try {
        await Pet.create(req.body);
        req.flash('success', 'Pet cadastrado com sucesso!');
        res.redirect('/admin/pets');
    } catch (error) {
        req.flash('error', 'Erro ao cadastrar pet');
        res.redirect('/admin/pets/new');
    }
});

router.get('/pets/:id/edit', isAdmin, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        res.render('admin/pets/edit', { pet });
    } catch (error) {
        req.flash('error', 'Pet não encontrado');
        res.redirect('/admin/pets');
    }
});

router.post('/pets/:id', isAdmin, async (req, res) => {
    try {
        await Pet.update(req.params.id, req.body);
        req.flash('success', 'Pet atualizado com sucesso!');
        res.redirect('/admin/pets');
    } catch (error) {
        req.flash('error', 'Erro ao atualizar pet');
        res.redirect(`/admin/pets/${req.params.id}/edit`);
    }
});

// Adoption Management
router.get('/adoptions', isAdmin, async (req, res) => {
    try {
        const adoptions = await Adoption.findAll();
        res.render('admin/adoptions/index', { adoptions });
    } catch (error) {
        req.flash('error', 'Erro ao carregar adoções');
        res.redirect('/admin/dashboard');
    }
});

router.post('/adoptions/:id/status', isAdmin, async (req, res) => {
    try {
        await Adoption.updateStatus(req.params.id, req.body.status);
        req.flash('success', 'Status da adoção atualizado!');
        res.redirect('/admin/adoptions');
    } catch (error) {
        req.flash('error', 'Erro ao atualizar status');
        res.redirect('/admin/adoptions');
    }
});

// Donation Management
router.get('/donations', isAdmin, async (req, res) => {
    try {
        const donations = await Donation.findAll();
        const monthlyTotal = await Donation.getMonthlyTotal();
        res.render('admin/donations/index', { donations, monthlyTotal });
    } catch (error) {
        req.flash('error', 'Erro ao carregar doações');
        res.redirect('/admin/dashboard');
    }
});

// User Management
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('admin/users/index', { users });
    } catch (error) {
        req.flash('error', 'Erro ao carregar usuários');
        res.redirect('/admin/dashboard');
    }
});

module.exports = router;