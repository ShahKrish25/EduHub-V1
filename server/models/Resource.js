// server/models/Resource.js
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  subject: { type: String }, // Optional for timetables
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["youtube", "handwritten", "pdf", "pyq", "solution", "timetable"], 
    required: true 
  },
  link: { type: String }, // For YouTube or PDFs
  fileUrl: { type: String }, // For uploaded files
  tableData: { // For timetable table format
    headers: [String],
    rows: [[String]]
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", resourceSchema);
