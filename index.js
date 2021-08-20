const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Data = require('./model');


require('dotenv').config();

const app = express();
const {LIVE_DATABASE, PASSWORD} = process.env;

mongoose.connect(LIVE_DATABASE, {
    auth: {
        user: 'admin',
        password: PASSWORD
    }
}, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.info('Db Connected!!!'))
.catch(err => console.error(err))

app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Setting view engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resume'));

app.use(express.static('resume'));
app.use('css', express.static(path.join(__dirname, 'assets/css')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/send', (req, res) => {
    const newData = new Data({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        date: Date.now()
    });
    newData.save();
    // res.redirect('/');
    res.render('success.ejs');
});

const port = process.env.PORT || 8000

app.listen(port, () => console.info(`App running on port ${port}`));
