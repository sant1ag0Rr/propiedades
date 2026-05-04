const env = require("../config/env");
const app = require("./app");

app.listen(env.port, () => {
  console.log(`API escuchando en http://localhost:${env.port}/api/v1`);
});
