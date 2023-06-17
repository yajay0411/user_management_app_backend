import express from "express";
import env from 'env';

const app = express();

//some middlewares for cross site data transactions
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(express.json());

import cors from "cors";
app.use(cors());


//server homepage:
app.get("", (req, res) => {
    res.status(200).send("<h1>Record Management Backend</h1>")
});


//Get Routes:

//get all
app.get('/api/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows) => {
        if (err) {
            return res.status(404).json(`ERROR:${err}`)
        } else {
            return res.status(200).json(rows)
        }
    });
});
//get detail
app.get('/api/users/:userID', (req, res) => {
    const { userID } = req.params;
    mysqlConnection.query('SELECT * FROM users WHERE id =?', [userID], (err, rows) => {
        if (err) {
            return res.status(404).json(`ERROR:${err}`);
        }
        return res.status(200).json(rows);
    })
})
//post 
app.post('/api/users', (req, res) => {
    const userDataObj = req.body;
    const userData = [userDataObj.first_name, userDataObj.last_name, userDataObj.email]

    mysqlConnection.query('INSERT INTO `users` (`first_name`, `last_name`, `email`) VALUES (?);', [userData], (err, rows) => {
        if (err) {
            return res.status(404).json(`ERROR:${err}`);
        }
        res.status(200).json(rows);
    })
})

//edit 
app.patch('/api/users/:userID', (req, res) => {
    const { userID } = req.params;
    const userData = req.body;
    mysqlConnection.query('UPDATE users SET ? WHERE id =' + userID, [userData], (err, rows) => {
        if (err) {
            return res.status(404).json(`ERROR:${err}`);
        }
        return res.status(200).json(rows);
    })
})

//delete
app.delete('/api/users/:userID', (req, res) => {
    const { userID } = req.params;
    mysqlConnection.query('DELETE FROM users WHERE id=?', [userID], (err, rows) => {
        if (err) {
            return res.status(404).json(`ERROR:${err}`);
        }
        return res.status(200).json(rows);
    })
})




//database connection :
import mysql from "mysql";
const mysqlConnection = mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
});
mysqlConnection.connect((err) => {
    if (err) {
        return console.log(`ERROR:${err}`);
    }
    app.listen(env.SERVER_PORT, () => {
        console.log(`MySQL connected successfully`);
        console.log(`app is listeing on ${SERVER_PORT}`);
    });
})