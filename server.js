require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 1000;
const hostname = '127.0.0.1';

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use('/', routes);

app.listen(port, () => {
    console.log(`+aquapulse is running at ${hostname}:${port}`);
});