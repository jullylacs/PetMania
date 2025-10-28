const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Aceitar apenas imagens
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // limite de 5MB
    }
});

app.use('/', CadastroController);
app.use('/', AnimaisController);
app.use('/', CadastroAnimaisController);


// Middleware Configuration
app.use(express.static(path.join('public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Global Middleware
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Configurando o EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', './views');

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'happypet'
});

// Verificando a conexão com o banco
db.connect(err => {
  if (err) {
    console.error('Erro de conexão com o banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados bem-sucedida!');
  }
});


////////////////ROTAS////////////////////

// Rota principal (EJS)
// Auth Routes
app.get('/login', (req, res) => {
    res.render('auth/login', { messages: req.flash() });
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

app.get('/register', (req, res) => {
    res.render('auth/register', { messages: req.flash() });
});

app.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            req.flash('error', 'Preencha todos os campos');
            return res.redirect('/register');
        }

        // Verificar se o email já existe
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
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Main Routes
app.get('/', async (req, res) => {
    try {
        const pets = await Pet.findAll();
        res.render('index', { pets });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.render('index', { pets: [] });
    }
});

// Pet Routes
app.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.findAll();
        res.render('pets/index', { pets });
    } catch (error) {
        req.flash('error', 'Erro ao carregar os pets');
        res.redirect('/');
    }
});

app.get('/pets/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        res.render('pets/show', { pet });
    } catch (error) {
        req.flash('error', 'Pet não encontrado');
        res.redirect('/pets');
    }
});

// Rota para páginas de pagamento
app.get('/formaPagamento', ensureAuthenticated, (req, res) => {
  res.render('formaPagamento'); 
}); //cards de forma de pagamento

app.get('/pixCompra', ensureAuthenticated, (req, res) => {
  res.render('pixCompra'); 
}); //pix para compras

app.get('/doacao', ensureAuthenticated, (req, res) => {
  res.render('doacao'); 
}); //pix para doações

app.get('/card', ensureAuthenticated, (req, res) => {
  res.render('card'); 
}); //cartão de crédito/débito

app.get('/cadastroCompras', ensureAuthenticated, (req, res) => {
  res.render('cadastroCompras'); 
}); //cadastro para proseguir com as compras

app.get('/indexCompras', ensureAuthenticated, (req, res) => {
  res.render('indexCompras'); 
}); // Página de início das compras


// Rotas para as páginas de produtos
app.get('/brinquedos', ensureAuthenticated, (req, res) => {
  res.render('brinquedos'); 
});
app.get('/higienes', ensureAuthenticated, (req, res) => {
  res.render('higienes'); 
});
app.get('/racoes', ensureAuthenticated, (req, res) => {
  res.render('racoes'); 
});
app.get('/camas', ensureAuthenticated, (req, res) => {
  res.render('camas'); 
});
app.get('/decoracoes', ensureAuthenticated, (req, res) => {
  res.render('decoracoes'); 
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`localhost ${3000}`);
});