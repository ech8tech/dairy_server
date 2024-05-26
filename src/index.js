const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001
const bodyParser = require('body-parser')
const e = require("express");
const sqlite3 = require('sqlite3').verbose();

app.use(bodyParser.json());

const db = new sqlite3.Database('src/database2', (err) => {
  if (err) {
    console.log(err.message)
    return;
  }
  console.log('Connected to database')
});

app.use(cors({
  origin: 'http://localhost:5173', // Разрешить доступ только с example.com
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
  credentials: true, // Разрешить отправку куки
}))

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS items (id TEXT, date TEXT, trigger TEXT, emotion TEXT, thoughts TEXT, behavior TEXT)");

  const sql = 'SELECT * From items'

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log(err.message)
    }
    rows.forEach(row => {
      console.log(row)
    })
  })
});

app.get('/', (req, res) => {
  db.all('SELECT * From items', [], (err, rows) => {
    if (err) {
      console.log(err.message)
    } else {
      res.json({ data: rows });
    }
  })
})

app.post('/add', (req, res) => {
  const { date, trigger, emotion, thoughts, behavior } = req.body;

  const stmt = db.prepare("INSERT INTO items VALUES (?, ?, ?, ?, ?, ?)")
  stmt.run(`1111`, date, trigger, emotion, thoughts, behavior);
  stmt.finalize();

  db.all('SELECT * From items', [], (err, rows) => {
    if (err) {
      console.log(err.message)
    } else {
      res.json({ data: rows.map((row => {
        const {id, ...rest} = row;
        return rest;
      }))})
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})