const User = require('../models/User');
const passport = require('passport');

class AuthController {
    static async getLogin(req, res) {
        res.render('auth/login', { messages: req.flash() });
    }

    static login(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }

    static async getRegister(req, res) {
        res.render('auth/register', { messages: req.flash() });
    }

    static async register(req, res) {
        try {
            const { nome, email, senha } = req.body;

            // Validação básica
            if (!nome || !email || !senha) {
                req.flash('error', 'Preencha todos os campos');
                return res.redirect('/register');
            }

            // Verificar se usuário já existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                req.flash('error', 'Email já cadastrado');
                return res.redirect('/register');
            }

            // Criar usuário
            await User.create({ nome, email, senha });
            req.flash('success', 'Cadastro realizado com sucesso!');
            res.redirect('/login');

        } catch (error) {
            console.error('Erro no registro:', error);
            req.flash('error', 'Erro ao realizar cadastro');
            res.redirect('/register');
        }
    }

    static logout(req, res, next) {
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
}

module.exports = AuthController;