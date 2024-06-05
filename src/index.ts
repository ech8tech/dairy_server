import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from "sqlite3";
import { v4 } from 'uuid';
import { RequestBody, ResponseData, RowData } from "./types";

const sql = sqlite3?.verbose();
const port = 8080;
const app = express();

app.use(bodyParser.json());

const db = new sql.Database('src/database', (err: any) => {
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
  db.run("CREATE TABLE IF NOT EXISTS records (id TEXT, date TEXT, time TEXT, trigger TEXT, emotionGroup TEXT, emotions TEXT, thoughts TEXT, behavior TEXT, weight TEXT)");
});

app.get('/', (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>) => {
  db.all('SELECT * From records', [], (err, rows: RowData[]) => {
    if (err) {
      console.log(err.message)
    } else {
      res.json({ data: rows.map(row => ({ ...row, emotions: JSON.parse(row.emotions) })) })
    }
  })
})

app.post('/add', (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>) => {
  const { date, time, trigger, emotionGroup, emotions, thoughts, behavior, weight } = req.body;

  const stmt = db.prepare("INSERT INTO records VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
  stmt.run(v4(), date, time, trigger, emotionGroup, JSON.stringify(emotions), thoughts, behavior, weight);
  stmt.finalize();

  db.all('SELECT * From records', [], (err, rows: RowData[]) => {
    if (err) {
      console.log(err.message)
    } else {
      res.json({ data: rows.map(row => ({ ...row, emotions: JSON.parse(row.emotions) })) })
    }
  })
})

app.delete('/delete/:id', (req: Request<{ id: string }, {}, RequestBody>, res: Response<ResponseData>) => {
  const id = req.params.id;

  const sql = 'DELETE FROM records WHERE id = ?';

  db.run(sql, [id], (err: any, row: any) => {
    if (err) {
      return res.status(500).json({ errors: [{ code: 500, message: 'Не удалось удалить запись'}] });
    }
  })

  db.all('SELECT * From records', [], (err, rows: RowData[]) => {
    if (err) {
      console.log(err.message)
    } else {
      res.json({ data: rows.map(row => ({ ...row, emotions: JSON.parse(row.emotions) })) })
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
