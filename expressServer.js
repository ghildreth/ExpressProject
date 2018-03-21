const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser')
app.use(cookieParser());

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

function generateRandomString() {
  let randoStr = '';
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++ ) {
    randoStr += possible.charAt(Math.floor(Math.random() * possible.length));
  }
      return randoStr;
}

app.get('/', function (request, response) {
  response.end('hello world');
});

app.get('/urls.json', (request, response) => {
  response.json(urlDatabase);
});

app.get('/hello', (request, response) => {
  response.end('<html><body>Hello <b>Wolrd</b></body</html>\n');
});

app.get('/urls', (request, response) => {
  const templateVars = {urls: urlDatabase,
                    username: request.cookies['username']
                         };
  response.render('urls_index', templateVars);
});

app.get('/urls/new', (request, response) => {
  const templateVars = {longURL: urlDatabase[request.params.id],
                       username: request.cookies['username']
                        };
  response.render('urls_new', templateVars);
});

app.get('/urls/:id', (request, response) => {
  console.log(request.params)
  const templateVars = {shortURL: request.params.id,
                       longURL: urlDatabase[request.params.id],
                       username: request.cookies['username']
                        };
  response.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (request, response) => {
  const longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL);
});

app.post('/urls', (request, response) => {
  // console.log(request.body.longURL);
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = request.body.longURL;
  response.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id/update', (request, response) => {
  console.log("is this working")
 urlDatabase[request.params.id] = request.body.longURL;
 response.redirect(`/urls/${request.params.id}`);
});

app.post('/login', (request, response) => {
  response.cookie("username", request.body.username);
  response.redirect('/urls');
});

app.post('/urls/:id/delete', (request, response) => {
  delete urlDatabase[req.params.id];
  response.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`TURNT MAH HEADPHONES UP TO ${PORT}`);
});