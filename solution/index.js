//setup express js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const db = require('./controllers/db');

app.use('/influencer', require('./routes/influencer'));
app.use('/company', require('./routes/company'));

app.get('/', async (req, res) => {
    res.json({
        message: 'Welcome!'
    })
})

//listen to port 3000
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})