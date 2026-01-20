const express = require("express");
const { readTodos, writeTodos } = require("./utils/db");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const todos = await readTodos();
  res.render("index", {
    todos,
    message: "Todo List",
    timestamp: new Date().toISOString(),
  });
});

app.post("/add", async (req, res) => {
  const todos = await readTodos();
  const newTodo = {
    id: Date.now().toString(),
    text: req.body.todo,
    created: new Date().toISOString(),
  };
  todos.push(newTodo);
  await writeTodos(todos);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const todos = await readTodos();
  const idToDelete = req.body.id;
  const filteredTodos = todos.filter((t) => t.id !== idToDelete);
  await writeTodos(filteredTodos);
  res.redirect("/");
});

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found.",
  });
});

module.exports = app;
