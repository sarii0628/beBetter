const express = require('express');
const mysql = require('mysql');
const app = express();
// const clipboardy = require('clipboardy');

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'beBetter'
// });

// const connection = mysql.createConnection({
//     host: 'us-cdbr-east-05.cleardb.net',
//     user: 'ba0cc08e2b00a0',
//     password: '7bf701f0',
//     database: 'heroku_34645c12ef887ff'
// });

var db_config = {
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'ba0cc08e2b00a0',
    password: '7bf701f0',
    database: 'heroku_34645c12ef887ff'
};

var connection = mysql.createPool(db_config);

// app.set('port', (process.env.PORT || 5000));


// 
// connection.connect((err) => {
//     if(err) {
//         console.log('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('success');
// });

connection.query('CREATE TABLE IF NOT EXISTS diets(id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, content TEXT, routine BOOLEAN, done BOOLEAN, timing INT)');


app.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM diets',
        (error, results) => {
            var morningItems = [];
            var middayItems = []; 
            var eveItems = [];
            results.forEach((result) =>  {
                switch(result.timing) {
                    case 0:
                        morningItems.push(result);
                        break;
                    case 1:
                        middayItems.push(result);
                        break;
                    default:
                        eveItems.push(result);
                        break;
                }
            })
            res.render('top.ejs', {items: results, morningItems: morningItems, middayItems: middayItems, eveItems: eveItems});
        }
    );
  
});

app.get('/addRoutine', (req, res) => {
    res.render('addRoutine.ejs');
});

app.post('/createRoutine', (req, res) => {
    connection.query(
        'INSERT INTO diets (content, routine, done, timing) VALUES (?,1,0,?)',
        [req.body.routineName, req.body.timing],
        (error,results) => {
            res.redirect('/');
        }
    );
});

app.get('/addDone', (req, res) => {
    res.render('addDone.ejs');
});

app.post('/createDone', (req, res) => {
    connection.query(
        'INSERT INTO diets (content, routine, done, timing) VALUES (?,0,1,?)',
        [req.body.doneName, req.body.timing],
        (error,results) => {
            res.redirect('/');
        }
    );
});

app.get('/edit/:id', (req, res) => {
    connection.query(
        'SELECT * FROM diets WHERE id = ?', 
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', {item: results[0]});
        }
    );
});

app.post('/update/:id', (req, res) => {
    connection.query(
        'UPDATE diets SET content=?, routine=?, done=? WHERE id=?',
        [req.body.itemName, req.body.routine, req.body.done, req.params.id],
        (error, results) => {
            res.redirect('/');
        }
    );
});

app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM diets WHERE id=?',
        [req.params.id],
        (error, results) => {
            res.redirect('/');
        }
    );
});

app.get('/record', (req, res) => {
    connection.query(
        'SELECT * FROM diets WHERE done=1',
        (error, results) => {
            var morningItems = [];
            var middayItems = []; 
            var eveItems = [];
            results.forEach((result) =>  {
                switch(result.timing) {
                    case 0:
                        morningItems.push(result);
                        break;
                    case 1:
                        middayItems.push(result);
                        break;
                    default:
                        eveItems.push(result);
                        break;
                }
            });
            var morning = "▶︎朝\n";
            var midday = "▶︎昼\n";
            var evening = "▶︎夕\n";

            morningItems.forEach((item) => {
                morning += item.content + "\n";
            });

            middayItems.forEach((item) => {
                midday += item.content + "\n";
            });

            eveItems.forEach((item) => {
                evening += item.content + "\n";
            });

            var sentence = morning +  midday + evening;
            // clipboardy.writeSync(sentence);
            console.log(sentence);
            res.render('record.ejs', {items: results, morningItems: morningItems, middayItems: middayItems, eveItems: eveItems});
        }
    );
});

app.post('/clear', (req, res) => {
    connection.query(
        'DELETE FROM diets WHERE routine=0',
        (error, results) => {
           
        }
    );
    connection.query(
        'UPDATE diets SET done=0',
        (error, results) => {
            res.redirect('/');
        }
    );
});

app.listen(process.env.PORT || 5000);