const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Por favor, faça login para acessar esta página');
    res.redirect('/login');
};

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash('error', 'Acesso restrito a administradores');
    res.redirect('/');
};

module.exports = {
    ensureAuthenticated,
    ensureAdmin
};