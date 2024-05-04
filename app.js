const express = require("express");
require("express-async-errors");
const notFoundMiddleware = require("./middlewares/not-found");
const errorhandlerMiddleware = require("./middlewares/Error");
const morgan = require("morgan");
require("dotenv").config();
const Authorization = require("./middlewares/Authorization");

const connectDB = require("./db/connect");

const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const app = express();

// get information about the route
app.use(morgan("tiny"));

//to access body in post request
app.use(express.json());
//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", Authorization, jobsRouter);

//middlewares
app.use(errorhandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log("listening at port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};
start();
