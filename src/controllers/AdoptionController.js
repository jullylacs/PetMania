const { Adoption, Pet, User } = require('../models');

class AdoptionController {
    async index(req, res) {
        try {
            const adoptions = await Adoption.findAll({
                where: { userId: req.user.id },
                include: [
                    { model: Pet },
                    { model: User }
                ]
            });
            return res.render('adoptions/index', { adoptions });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao listar solicitações de adoção');
            return res.redirect('/');
        }
    }

    async request(req, res) {
        try {
            const pet = await Pet.findByPk(req.params.petId);
            if (!pet) {
                req.flash('error', 'Pet não encontrado');
                return res.redirect('/pets');
            }

            if (pet.status !== 'disponivel') {
                req.flash('error', 'Este pet não está disponível para adoção');
                return res.redirect('/pets');
            }

            await Adoption.create({
                petId: pet.id,
                userId: req.user.id,
                status: 'pendente'
            });

            req.flash('success', 'Solicitação de adoção enviada com sucesso');
            return res.redirect('/adoption');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao solicitar adoção');
            return res.redirect('/pets');
        }
    }

    async adminIndex(req, res) {
        try {
            const adoptions = await Adoption.findAll({
                include: [
                    { model: Pet },
                    { model: User }
                ]
            });
            return res.render('admin/adoptions/index', { adoptions });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao listar solicitações de adoção');
            return res.redirect('/admin');
        }
    }

    async approve(req, res) {
        try {
            const adoption = await Adoption.findByPk(req.params.id, {
                include: [{ model: Pet }]
            });

            if (!adoption) {
                req.flash('error', 'Solicitação de adoção não encontrada');
                return res.redirect('/admin/adoptions');
            }

            await adoption.update({ status: 'aprovada' });
            await adoption.Pet.update({ status: 'adotado' });

            req.flash('success', 'Solicitação de adoção aprovada com sucesso');
            return res.redirect('/admin/adoptions');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao aprovar solicitação de adoção');
            return res.redirect('/admin/adoptions');
        }
    }

    async reject(req, res) {
        try {
            const adoption = await Adoption.findByPk(req.params.id, {
                include: [{ model: Pet }]
            });

            if (!adoption) {
                req.flash('error', 'Solicitação de adoção não encontrada');
                return res.redirect('/admin/adoptions');
            }

            await adoption.update({ status: 'rejeitada' });
            await adoption.Pet.update({ status: 'disponivel' });

            req.flash('success', 'Solicitação de adoção rejeitada');
            return res.redirect('/admin/adoptions');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao rejeitar solicitação de adoção');
            return res.redirect('/admin/adoptions');
        }
    }
}

module.exports = new AdoptionController();