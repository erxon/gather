import dbConnect from "@/db/dbConnect";
import Report from "@/db/report";

const getReport = async (req, res, next) => {
  try {
    await dbConnect();

    const getReport = await Report.findById(req.body.reportId);
    req.report = getReport;
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "something went wrong." });
  }
};

const getTasks = async (req, res) => {
  const { reportId } = req.query;
  try {
    await dbConnect();

    const tasks = await Report.findById(reportId).select("tasks");

    res.status(200).json(tasks);
  } catch (error) {
    res.json({ error: error, message: "something went wrong." });
  }
};

const createTask = async (req, res) => {
  const { reportId } = req.query;
  try {
    await dbConnect();

    const newTask = {
      createdAt: new Date(),
      name: req.body.name,
      done: req.body.done,
    };

    const update = await Report.findByIdAndUpdate(reportId, {
      $push: { tasks: newTask },
    });

    res.status(200).json({ update, message: "new task added." });
  } catch (error) {
    res.json({ error: error, message: "something went wrong." });
  }
};

const remove = async (req, res) => {
  const { id } = req.query;

  try {
    await dbConnect();

    await Report.findByIdAndUpdate(req.body.reportId, {
      $pull: { tasks: { _id: id } },
    });

    res.status(200).json({ task: id, message: "task removed." });
  } catch (error) {
    res.status(400).json({ error: error, message: "something went wrong." });
  }
};

const update = async (req, res) => {
  const { id } = req.query;
  try {
    await dbConnect();

    const report = req.report;
    const task = report.tasks.find((task) => {
      return task._id.toString() === id;
    });
    task.name === req.body.name;
    const updateReport = await Report.findByIdAndUpdate(req.body.reportId, {
      tasks: { $elemMatch: { task } },
    });
    console.log(updateReport);
  } catch (error) {
    res.status(400).json({ error: error, message: "something went wrong." });
  }
};

export { getReport, getTasks, createTask, remove, update };
