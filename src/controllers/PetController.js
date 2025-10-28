const Pet = require('../models/Pet');

class PetController {
    static async index(req, res) {
        try {
            const pets = await Pet.findAll();
            res.render('pets/index', { pets });
        } catch (error) {
            req.flash('error', 'Erro ao carregar os pets');
            res.redirect('/');
        }
    }

    static async show(req, res) {
        try {
            const pet = await Pet.findByPk(req.params.id);
            if (!pet) {
                req.flash('error', 'Pet não encontrado');
                return res.redirect('/pets');
            }
            res.render('pets/show', { pet });
        } catch (error) {
            req.flash('error', 'Erro ao carregar o pet');
            res.redirect('/pets');
        }
    }

    static async create(req, res) {
        res.render('admin/pets/new');
    }

    static async store(req, res) {
        try {
            const { nome, especie, raca, idade, sexo, porte, descricao } = req.body;
            const imagem = req.file ? req.file.filename : null;

            await Pet.create({
                nome, especie, raca, idade, sexo, porte, descricao, imagem
            });

            req.flash('success', 'Pet cadastrado com sucesso!');
            res.redirect('/admin/pets');
        } catch (error) {
            console.error('Erro ao cadastrar pet:', error);
            req.flash('error', 'Erro ao cadastrar pet');
            res.redirect('/admin/pets/new');
        }
    }

    static async edit(req, res) {
        try {
            const pet = await Pet.findByPk(req.params.id);
            if (!pet) {
                req.flash('error', 'Pet não encontrado');
                return res.redirect('/admin/pets');
            }
            res.render('admin/pets/edit', { pet });
        } catch (error) {
            req.flash('error', 'Erro ao carregar o pet');
            res.redirect('/admin/pets');
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, especie, raca, idade, sexo, porte, descricao, status } = req.body;
            const imagem = req.file ? req.file.filename : undefined;

            const pet = await Pet.findByPk(id);
            if (!pet) {
                req.flash('error', 'Pet não encontrado');
                return res.redirect('/admin/pets');
            }

            await pet.update({
                nome, especie, raca, idade, sexo, porte, descricao, status,
                ...(imagem && { imagem })
            });

            req.flash('success', 'Pet atualizado com sucesso!');
            res.redirect('/admin/pets');
        } catch (error) {
            console.error('Erro ao atualizar pet:', error);
            req.flash('error', 'Erro ao atualizar pet');
            res.redirect(`/admin/pets/edit/${req.params.id}`);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Pet.destroy({ where: { id } });
            req.flash('success', 'Pet removido com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar pet:', error);
            req.flash('error', 'Erro ao remover pet');
        }
        res.redirect('/admin/pets');
    }
}

module.exports = PetController;