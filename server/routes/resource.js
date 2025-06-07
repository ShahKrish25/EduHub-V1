// server/routes/resource.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Resource = require("../models/Resource");
const Branch = require("../models/Branch");
// const auth = require("../middleware/auth");
const fs = require("fs");

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Helper function to delete file
const deleteFile = async (filePath) => {
  try {
    // Convert relative path to absolute path
    const absolutePath = path.join(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
      console.log('File deleted successfully:', absolutePath);
    } else {
      console.log('File not found:', absolutePath);
    }
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
};

// router.post("/upload", auth, upload.single("file"), async (req, res) => {
  router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { branch, semester, subject, title, type, link, tableData } = req.body;
    console.log('Upload request:', { branch, semester, subject, title, type, link, tableData }); // Debug log

    const resourceData = {
      branch,
      semester: Number(semester),
      title,
      type,
      link: link || null,
      fileUrl: req.file ? req.file.path : null,
    };

    // Add subject only if it's not a timetable
    if (type !== "timetable") {
      resourceData.subject = subject;
    }

    // Add tableData if it's a timetable in table format
    if (type === "timetable" && tableData) {
      try {
        resourceData.tableData = JSON.parse(tableData);
      } catch (err) {
        console.error('Error parsing tableData:', err);
        return res.status(400).json({ error: "Invalid table data format" });
      }
    }

    const resource = new Resource(resourceData);
    await resource.save();
    res.status(201).json({ message: "Resource uploaded successfully ✅" });
  } catch (err) {
    console.error('Upload error:', err); // Debug log
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

// router.get("/subjects", auth, async (req, res) => {
router.get("/subjects", async (req, res) => {
  const { branch, semester } = req.query;
  try {
    console.log('Subjects request:', { branch, semester }); // Debug log
    const branchDoc = await Branch.findOne({ name: branch });
    if (!branchDoc) return res.status(404).json({ subjects: [] });
    const sem = branchDoc.semesters.find(s => s.number === Number(semester));
    if (!sem) return res.status(404).json({ subjects: [] });
    res.json({ subjects: sem.subjects.map(sub => sub.name) });
  } catch (err) {
    console.error('Subjects error:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
});

// router.get("/", auth, async (req, res) => {
router.get("/", async (req, res) => {
  const { branch, semester, subject, type } = req.query;
  try {
    console.log('Resources request:', { branch, semester, subject, type }); // Debug log
    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    
    console.log('MongoDB filter:', filter); // Debug log
    const resources = await Resource.find(filter);
    console.log('Found resources:', resources); // Debug log
    
    res.json(resources);
  } catch (err) {
    console.error('Resources error:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
});

// Add DELETE route
router.delete("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Delete the file if it exists
    if (resource.fileUrl) {
      try {
        await deleteFile(resource.fileUrl);
      } catch (err) {
        console.error("Error deleting file:", err);
        // Continue with resource deletion even if file deletion fails
      }
    }

    await resource.deleteOne();
    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

// Add PUT route for updating resources
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Update basic fields from form data
    if (req.body.title) resource.title = req.body.title;
    if (req.body.description !== undefined) resource.description = req.body.description;
    if (req.body.link !== undefined) resource.link = req.body.link;

    // Handle file update if a new file is uploaded
    if (req.file) {
      // Delete old file if it exists
      if (resource.fileUrl) {
        try {
          await deleteFile(resource.fileUrl);
        } catch (err) {
          console.error("Error deleting old file:", err);
          // Continue with update even if old file deletion fails
        }
      }
      // Update with new file
      resource.fileUrl = req.file.path;
    }

    await resource.save();
    res.json({ 
      message: "Resource updated successfully", 
      resource: {
        ...resource.toObject(),
        fileUrl: resource.fileUrl ? `http://localhost:5000/${resource.fileUrl}` : null
      }
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// Add stats route
router.get("/stats", async (req, res) => {
  try {
    // Get total resources count
    const totalResources = await Resource.countDocuments();

    // Get branch-wise stats
    const branchStats = await Resource.aggregate([
      {
        $group: {
          _id: "$branch",
          count: { $sum: 1 }
        }
      }
    ]).then(results => 
      results.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {})
    );

    // Get type-wise stats
    const typeStats = await Resource.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]).then(results => 
      results.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {})
    );

    // Get recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = await Resource.countDocuments({
      uploadedAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalResources,
      branchStats,
      typeStats,
      recentUploads
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
