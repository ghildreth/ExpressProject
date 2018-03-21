var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

app.get('/', function (request, response) {
  response.end('hello world');
});

app.get('/urls.json', (request, response) => {
  response.json(urlDatabase);
});

app.get('/hello', (request, response) => {
  response.end('<html><body>Hello <b>Wolrd</b></body</html>\n');
})

app.get('/urls', (request, response) => {
  let templateVars = {urls: urlDatabase };
  response.render('urls_index', templateVars);
})

app.get('/urls/new', (request, response) => {
  let templateVars = {longURL: urlDatabase[request.params.id] };
  response.render('urls_new', templateVars);
});

app.get('/urls/:id', (request, response) => {
  console.log(request.params)
  let templateVars = {shortURL: request.params.id,
                      longURL: urlDatabase[request.params.id] };
  response.render('urls_show', templateVars);
});

app.post('/urls', (request, response) => {
  console.log(request.body.longURL);
  response.send("Ok");
});



app.listen(PORT, () => {
  console.log(`TURNT MAH HEADPHONES UP TO ${PORT}`);
});