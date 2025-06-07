const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const semesterSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  subjects: [subjectSchema]
});

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  semesters: [semesterSchema]
});

module.exports = mongoose.model("Branch", branchSchema);