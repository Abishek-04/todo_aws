const app = require("./app");
const port = 3000;

app.listen(port, () => {
  console.log(`Local app listening on http://localhost:${port}`);
});
