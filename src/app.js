const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const v1Routes = require("./routes");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", v1Routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
