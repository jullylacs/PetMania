const { Donation, User } = require('../models');

class DonationController {
    async index(req, res) {
        try {
            const donations = await Donation.findAll({
                include: [{ model: User }]
            });
            return res.render('donations/index', { donations });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao listar doações');
            return res.redirect('/');
        }
    }

    async create(req, res) {
        return res.render('donations/new');
    }

    async store(req, res) {
        try {
            const { valor, mensagem } = req.body;
            const donation = await Donation.create({
                userId: req.user.id,
                valor: parseFloat(valor),
                mensagem,
                status: 'pendente'
            });

            req.flash('success', 'Doação registrada com sucesso');
            return res.redirect(`/donations/payment/${donation.id}`);
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao registrar doação');
            return res.redirect('/donations/new');
        }
    }

    async paymentForm(req, res) {
        try {
            const donation = await Donation.findOne({
                where: {
                    id: req.params.id,
                    userId: req.user.id,
                    status: 'pendente'
                }
            });

            if (!donation) {
                req.flash('error', 'Doação não encontrada');
                return res.redirect('/donations');
            }

            return res.render('donations/payment', { donation });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao carregar página de pagamento');
            return res.redirect('/donations');
        }
    }

    async processPayment(req, res) {
        try {
            const donation = await Donation.findOne({
                where: {
                    id: req.params.id,
                    userId: req.user.id,
                    status: 'pendente'
                }
            });

            if (!donation) {
                req.flash('error', 'Doação não encontrada');
                return res.redirect('/donations');
            }

            const { paymentMethod } = req.body;
            
            // Aqui você implementaria a lógica de processamento do pagamento
            // com a integração do gateway de pagamento escolhido

            await donation.update({
                status: 'aprovada',
                formaPagamento: paymentMethod
            });

            req.flash('success', 'Pagamento processado com sucesso. Obrigado pela sua doação!');
            return res.redirect('/donations');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao processar pagamento');
            return res.redirect(`/donations/payment/${req.params.id}`);
        }
    }
}

module.exports = new DonationController();