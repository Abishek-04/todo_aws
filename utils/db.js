const fs = require("fs").promises;
const path = require("path");

const DB_PATH = path.join(__dirname, "../data.json");

async function readTodos() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeTodos(todos) {
  await fs.writeFile(DB_PATH, JSON.stringify(todos, null, 2));
}

module.exports = { readTodos, writeTodos };
