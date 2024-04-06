require("dotenv").config();
const express = require("express");
const userRoutes = require("./Routes/userRoutes");
const questionRoutes = require("./Routes/questionRoutes");
const answerRoutes = require("./Routes/answerRoutes");
const authorize = require("./Middlewares/authorizationMiddleware");
const cors = require("cors");

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/questions", authorize, questionRoutes);
app.use("/api/answers", authorize, answerRoutes);
async function start() {
  try {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
