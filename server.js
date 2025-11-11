// ---------------------- IMPORTS ----------------------
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const passport = require('passport');
const multer = require('multer');
const { ensureAuthenticated, ensureAdmin } = require('./config/auth');
require('./config/passport')(passport);

const app = express();
const port = 3000;

// ---------------------- CONFIGURAÇÕES ESSENCIAIS ----------------------
// ✅ Estes middlewares devem vir antes das rotas
app.use(express.urlencoded({ extended: true })); // Permite ler dados de forms
app.use(express.json()); // Permite ler JSON (AJAX/API)
app.use(express.static(path.join(__dirname, 'public'))); // Acesso a /public

// ---------------------- MULTER (UPLOAD DE IMAGENS) ----------------------
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
            return cb(new Error('Apenas arquivos de imagem são permitidos!'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ---------------------- MODELOS E CONTROLADORES ----------------------
const CadastroController = require("./cadastro/CadastroController");
const Cadastro = require("./cadastro/Cadastro");
const AnimaisController = require("./animais/AnimaisController");
const Animais = require("./animais/Animais");
const CadastroAnimaisController = require("./cadastro_animais/Cadastro_AnimaisController");

// ---------------------- SESSÃO E FLASH ----------------------
app.use(flash());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24h
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware global
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// ---------------------- VIEW ENGINE ----------------------
app.set('view engine', 'ejs');
app.set('views', './views');

// ---------------------- CONTROLADORES ----------------------
app.use('/', CadastroController);
app.use('/', AnimaisController);
app.use('/', CadastroAnimaisController);

// ---------------------- ROTAS DE AUTENTICAÇÃO ----------------------
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

// ---------------------- PÁGINA PRINCIPAL ----------------------
app.get('/', async (req, res) => {
    try {
        const pets = await Animais.findAll();
        res.render('index', { pets });
    } catch (error) {
        console.error('Erro ao buscar pets:', error);
        res.render('index', { pets: [] });
    }
});

// ---------------------- ÁREA ADMIN ----------------------
// Página de listagem
app.get('/admin/animaisAdd', ensureAdmin, async (req, res) => {
    try {
        const animais = await Animais.findAll({ order: [['id', 'DESC']] });
        res.render('admin/animaisAdd/index', { animais });
    } catch (err) {
        console.error('Erro ao listar animais:', err);
        res.render('admin/animaisAdd/index', { animais: [] });
    }
});

// Página de cadastro
app.get('/admin/animaisAdd/new', ensureAdmin, (req, res) => {
    res.render('admin/animaisAdd/new');
});

// Rota POST para salvar novo animal com upload de imagem
app.post('/admin/animais/save', ensureAdmin, upload.single('imagem'), async (req, res) => {
    console.log('Body recebido:', req.body);
    console.log('File recebido:', req.file);

    const { nome, descricao } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : '';

    if (!nome || !descricao) {
        req.flash('error', 'Preencha todos os campos obrigatórios!');
        return res.redirect('/admin/animaisAdd/new');
    }

    try {
        await Animais.create({ nome, descricao, imagem });
        req.flash('success', 'Animal cadastrado com sucesso!');
        res.redirect('/admin/animaisAdd');
    } catch (err) {
        console.error('Erro ao salvar animal:', err);
        req.flash('error', 'Erro ao cadastrar o animal.');
        res.redirect('/admin/animaisAdd/new');
    }
});

// Página de edição de animal (formulário)
app.get('/admin/animaisAdd/edit/:id', ensureAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const animal = await Animais.findByPk(id);
        if (!animal) {
            req.flash('error', 'Animal não encontrado!');
            return res.redirect('/admin/animaisAdd');
        }

        res.render('admin/animaisAdd/edit', { animal });
    } catch (err) {
        console.error('Erro ao carregar página de edição:', err);
        req.flash('error', 'Erro ao carregar a página de edição.');
        res.redirect('/admin/animaisAdd');
    }
});


// Deletar animal (via GET – simples e funcional)
app.get('/admin/animaisAdd/delete/:id', ensureAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const animal = await Animais.findByPk(id);
        if (!animal) {
            req.flash('error', 'Animal não encontrado!');
            return res.redirect('/admin/animaisAdd');
        }

        await animal.destroy();
        req.flash('success', 'Animal deletado com sucesso!');
        res.redirect('/admin/animaisAdd');
    } catch (err) {
        console.error('Erro ao deletar animal:', err);
        req.flash('error', 'Erro ao deletar o animal.');
        res.redirect('/admin/animaisAdd');
    }
});


// ---------------------- PÁGINAS PROTEGIDAS ----------------------
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

// ---------------------- BANCO DE DADOS ----------------------
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

// ---------------------- INICIAR SERVIDOR ----------------------
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
