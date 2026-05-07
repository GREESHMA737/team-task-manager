const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const dotenv = require("dotenv");

const path = require("path");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// SERVE FRONTEND

app.use(express.static(path.join(__dirname, "../client")));

// ROUTES

const authRoutes = require("./routes/authRoutes");

const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

// ROOT ROUTE

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/login.html"));
});

// MONGODB

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log("MongoDB Connected");
  })

  .catch((err) => {
    console.log(err);
  });

// PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
