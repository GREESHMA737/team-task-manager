const express = require("express");

const Task = require("../models/Task");

const router = express.Router();

// CREATE TASK

router.post("/create", async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const parsedDate = new Date(dueDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      return res.status(400).json({
        message: "Due date cannot be in the past",
      });
    }

    const newTask = new Task({
      title,
      description,
      dueDate: parsedDate,
      priority,
    });

    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL TASKS

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE TASK STATUS

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.status(200).json({
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE TASK

router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
