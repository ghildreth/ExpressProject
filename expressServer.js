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

const users = {
  "userRandomID": {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
}

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

app.get('/register', (request, response) => {
  response.render('register');
});

app.post('/urls', (request, response) => {

  let shortURL = generateRandomString();
  urlDatabase[shortURL] = request.body.longURL;
  response.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id/update', (request, response) => {

 urlDatabase[request.params.id] = request.body.longURL;
 response.redirect(`/urls/${request.params.id}`);
});

app.post('/login', (request, response) => {
  response.cookie("username", request.body.username);
  response.redirect('/urls');
});

app.post('/logout', (request, response) => {
  response.clearCookie("username", request.body.username);
  response.redirect('/urls');
});

app.post('/register', (request, response) => {
  let newUserId = generateRandomString();
  response.cookie('user_id', newUserId);

  for(let key in users) {
    const user = users[key];
    if (user.email === request.body.email) {
      return response.sendStatus(400);
    }
  }

  if(request.body.email && request.body.password){
      users[newUserId] = {
      id: newUserId,
      email: request.body.email,
      password: request.body.password
      }
      console.log(users);
      response.redirect('/urls');

  } else {
    response.status(400);
    response.send("You shall not pass... Please either enter a valid e-mail or password!");
  }

});
app.post('/urls/:id/delete', (request, response) => {
  delete urlDatabase[request.params.id];
  response.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`TURNT MAH HEADPHONES UP TO ${PORT}`);
});