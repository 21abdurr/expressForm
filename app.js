import express from "express";
import router from "./routes/api.js";
import morgan from "morgan";
import connection from "./connection.js";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/", router);

app.use((req, res) => {
  res.status(404).json({ message: "404 Page not found" });
});

connection();

app.listen(env.SERVER_PORT || 4000, () =>
  console.log(`Server running at http://localhost:${env.SERVER_PORT}`)
);
