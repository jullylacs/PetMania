const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const passport = require('passport');
const { ensureAuthenticated, ensureAdmin } = require('./config/auth');
require('./config/passport')(passport);

const app = express();
const port = 3000;

// Controllers
const CadastroController = require("./cadastro/CadastroController");
const Cadastro = require("./cadastro/Cadastro");
const AnimaisController = require("./animais/AnimaisController");
const Animais = require("./animais/Animais");
const CadastroAnimaisController = require("./cadastro_animais/Cadastro_AnimaisController");

// Configuração do upload de arquivos
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ---------------------- MIDDLEWARES ----------------------

// Configurações estáticas e parse de body
app.use(express.static(path.join('public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Flash messages e sessão
app.use(flash());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24h
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware global - IMPORTANTE: deve vir antes das rotas!
app.use((req, res, next) => {
    res.locals.user = req.user || null; // garante que user nunca seja undefined
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// ---------------------- VIEWS ----------------------
app.set('view engine', 'ejs');
app.set('views', './views');

// ---------------------- CONTROLLERS ----------------------
app.use('/', CadastroController);
app.use('/', AnimaisController);
app.use('/', CadastroAnimaisController);

// ---------------------- ROTAS MANUAIS ----------------------

// Auth
app.get('/login', (req, res) => res.render('auth/login', { messages: req.flash() }));

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

app.get('/register', (req, res) => res.render('auth/register', { messages: req.flash() }));

app.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            req.flash('error', 'Preencha todos os campos');
            return res.redirect('/register');
        }

        const existingUser = await Cadastro.findOne({ where: { email } });
        if (existingUser) {
            req.flash('error', 'Email já cadastrado');
            return res.redirect('/register');
        }

        const hashed = await bcrypt.hash(senha, 10);
        await Cadastro.create({ nome, email, senha: hashed });
        req.flash('success', 'Cadastro realizado com sucesso!');
        res.redirect('/login');
    } catch (error) {
        console.error('Erro no registro:', error);
        req.flash('error', 'Erro ao realizar cadastro');
        res.redirect('/register');
    }
});

app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// Main Routes
app.get('/', async (req, res) => {
    try {
        const pets = await Animais.findAll();
        res.render('index', { pets });
    } catch (error) {
        console.error('Erro ao buscar pets:', error);
        res.render('index', { pets: [] });
    }
});

// Páginas protegidas
app.get('/formaPagamento', ensureAuthenticated, (req, res) => res.render('formaPagamento'));
app.get('/pixCompra', ensureAuthenticated, (req, res) => res.render('pixCompra'));
app.get('/doacao', ensureAuthenticated, (req, res) => res.render('doacao'));
app.get('/card', ensureAuthenticated, (req, res) => res.render('card'));
app.get('/cadastroCompras', ensureAuthenticated, (req, res) => res.render('cadastroCompras'));
app.get('/indexCompras', ensureAuthenticated, (req, res) => res.render('indexCompras'));

// Produtos
['brinquedos','higienes','racoes','camas','decoracoes'].forEach(route => {
    app.get(`/${route}`, ensureAuthenticated, (req, res) => res.render(route));
});

// ---------------------- DATABASE CONNECTION ----------------------
async function connectDB() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'happypet'
        });
        console.log('Conexão com o banco de dados bem-sucedida!');
        return db;
    } catch (err) {
        console.error('Erro de conexão com o banco de dados:', err);
    }
}

// ---------------------- START SERVER ----------------------
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
