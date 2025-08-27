const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

const CadastroController = require("./cadastro/CadastroController");
const Cadastro = require("./cadastro/Cadastro");

app.use('/', CadastroController);

// Middleware para servir arquivos estáticos
app.use(express.static(path.join('public')));

// Middleware para analisar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Caso precise receber JSON

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
app.get('/', (req, res) => {
  res.render('index'); // Renderiza index.ejs
});

// Rota para a página de animais
app.get('/animais', (req, res) => {
  res.render('animais'); 
});

// Rota para páginas de pagamento
app.get('/formaPagamento', (req, res) => {
  res.render('formaPagamento'); 
}); //cards de forma de pagamento

app.get('/pixCompra', (req, res) => {
  res.render('pixCompra'); 
}); //pix para compras

app.get('/doacao', (req, res) => {
  res.render('doacao'); 
}); //pix para doações

app.get('/card', (req, res) => {
  res.render('card'); 
}); //cartão de crédito/débito

app.get('/cadastroCompras', (req, res) => {
  res.render('cadastroCompras'); 
}); //cadastro para proseguir com as compras

app.get('/indexCompras', (req, res) => {
  res.render('indexCompras'); 
}); // Página de início das compras


// Rotas para as páginas de produtos
app.get('/brinquedos', (req, res) => {
  res.render('brinquedos'); 
});
app.get('/higienes', (req, res) => {
  res.render('higienes'); 
});
app.get('/racoes', (req, res) => {
  res.render('racoes'); 
});
app.get('/camas', (req, res) => {
  res.render('camas'); 
});
app.get('/decoracoes', (req, res) => {
  res.render('decoracoes'); 
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`localhost ${3000}`);
});