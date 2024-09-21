const express = require("express");
const cors = require("cors");
const app = express();
const mysql2 = require("mysql2");

const server = app.listen(3000, function() {
  console.log("Node.js is listening to PORT:" + server.address().port);
});

app.disable("x-powerd-by");
app.use(cors()).use(express.json());

const connection = mysql2.createConnection({
  host: "localhost",
  port: 3306,
  user: "user",
  password: "password",
  database: "sample",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected mysql");
});

app.get("/api/todos",(req, res) => {
  const sql = "select * from todos";
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});

app.get("/api/todos/:id",(req, res) => {
  const id = req.params.id;
  const sql = "select * from todos where ?";
  connection.query(sql, {id: id},(err, results) => {
    if (err) throw err;
    res.status(200).json(results[0]);
  });
});

app.post("/api/todos",(req, res) => {
  const todo = req.body;
  const sql = "insert into todos set ?";
  connection.query(sql, todo, (err, result) => {
    if (err) throw err;
    res.status(201).json(result.id);
  });
});

// ↓ 演習課題の回答
// todoを更新する
app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const todo = req.body;
  const sql = `update todos set title='${todo.title}', description='${todo.description}' where id=${id}`;
  connection.query(sql, null, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// todoを削除する
app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const sql = 'delete from todos where ?';
  connection.query(sql, { id: id }, (err) => {
    if (err) throw err;
    res.status(200).send();
  });
});
