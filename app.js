const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beBetter'
});

connection.connect((err) => {
    if(err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('success');
});

app.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM diets',
        (error, results) => {
            console.log(results);
            res.render('top.ejs');
        }
    );
  
});

app.listen(3000);