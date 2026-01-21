const fs = require("fs").promises;
const fsConstants = require("fs").constants;
const path = require("path");
const os = require("os");

const LOCAL_DB_PATH = path.join(__dirname, "../data.json");
const TEMP_DB_PATH = path.join(os.tmpdir(), "data.json");

// Cache the determined path so we don't check every time
let activeDbPath = null;

async function getDbPath() {
  if (activeDbPath) return activeDbPath;

  try {
    // Try to access the project root directory with Write permissions
    // We check the directory because we might need to create the file if it doesn't exist
    await fs.access(path.join(__dirname, "../"), fsConstants.W_OK);
    activeDbPath = LOCAL_DB_PATH;
  } catch (error) {
    // Fallback to temp directory if local is read-only (which happens in Lambda /var/task)
    // No need to check for env vars, simply check capabilities
    activeDbPath = TEMP_DB_PATH;
  }
  return activeDbPath;
}

async function ensureDbExists() {
  const dbPath = await getDbPath();
  try {
    await fs.access(dbPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(dbPath, "[]");
    } else {
      throw error;
    }
  }
  return dbPath;
}

async function readTodos() {
  const dbPath = await ensureDbExists();
  try {
    const data = await fs.readFile(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeTodos(todos) {
  const dbPath = await ensureDbExists();
  await fs.writeFile(dbPath, JSON.stringify(todos, null, 2));
}

module.exports = { readTodos, writeTodos };