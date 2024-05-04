const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadReq } = require("../errors");
const Jobs = require("../models/jobs");

const getAllJobs = async (req, res) => {
  const jobs = await Jobs.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  if (jobs.length <= 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "add some jobs bro" });
  }
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//delete job
const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Jobs.findByIdAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no job found with id ${jobId}` });
  }
  res.json({ msg: "job deleted" });
};

//update job
const updateJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
    body: { status },
  } = req;
  if (status == "") {
    throw new BadReq("status should be provide");
  }
  const job = await Jobs.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ success: true, job });
};

//single job
const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Jobs.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no job found with id ${jobId}` });
  }

  res.status(StatusCodes.OK).json(job);
};

module.exports = { getAllJobs, createJob, deleteJob, updateJob, getJob };
