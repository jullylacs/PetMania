const LocalStrategy = require('passport-local').Strategy;
const Cadastro = require('../cadastro/Cadastro');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'senha'
  }, async (email, senha, done) => {
    try {
      const user = await Cadastro.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Email não encontrado' });
      }

      const match = await bcrypt.compare(senha, user.senha);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Senha incorreta' });
      }
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Cadastro.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};