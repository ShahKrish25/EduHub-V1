// server/routes/resource.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Resource = require("../models/Resource");
const Branch = require("../models/Branch");
// const auth = require("../middleware/auth");
const fs = require("fs");
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto';
    const mimeType = file.mimetype;
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    // For PDFs and other documents, we'll use 'raw' type
    if (mimeType === 'application/pdf' || 
        mimeType === 'application/msword' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/vnd.ms-powerpoint' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        mimeType === 'text/plain') {
      resourceType = 'raw';
    } else if (mimeType.startsWith('image/')) {
      resourceType = 'image';
    }

    // Generate a unique filename with extension
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    return {
      folder: 'studyhub-resources',
      access_mode: "public",
      allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'txt'],
      resource_type: resourceType,
      public_id: uniqueFilename,
      format: fileExtension
    };
  }
});

const upload = multer({ storage: storage });

// Helper function to delete file from Cloudinary
const deleteFile = async (cloudinaryId, fileUrl) => {
  try {
    if (!cloudinaryId && !fileUrl) return;
    
    let publicId = cloudinaryId;
    let resourceType = 'image';
    
    // If we don't have cloudinaryId, try to extract from URL
    if (!publicId && fileUrl) {
      // Extract public_id from Cloudinary URL
      const urlParts = fileUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
        // Get everything after 'upload/'
        const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
        // Remove file extension for public_id
        publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
      }
    }
    
    if (publicId) {
      // Extract the actual filename without folder path for resource type detection
      const filename = publicId.split('/').pop();
      const ext = filename.split('.').pop()?.toLowerCase();
      
      // Determine resource type based on extension
      if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) {
        resourceType = 'raw';
      } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) {
        resourceType = 'video';
      } else {
        resourceType = 'image';
      }
      
      console.log(`Attempting to delete from Cloudinary - Public ID: ${publicId}, Resource Type: ${resourceType}`);
      
      const result = await cloudinary.uploader.destroy(publicId, { 
        resource_type: resourceType,
        invalidate: true // This ensures CDN cache is cleared
      });
      
      console.log('Cloudinary deletion result:', result);
      
      if (result.result === 'ok') {
        console.log('File deleted successfully from Cloudinary:', publicId);
      } else {
        console.warn('File deletion from Cloudinary returned:', result.result);
      }
    }
  } catch (err) {
    console.error('Error deleting file from Cloudinary:', err);
    // Don't throw error - we want the resource update to continue even if file deletion fails
  }
};

// Helper function to format Cloudinary URL
const formatCloudinaryUrl = (url, type) => {
  if (!url) return null;
  
  // If it's a PDF or document, ensure we're using the correct delivery type
  if (type === 'pdf' || type === 'doc' || type === 'docx' || type === 'ppt' || type === 'pptx' || type === 'txt') {
    // Replace /image/upload/ with /raw/upload/ if it exists
    url = url.replace('/image/upload/', '/raw/upload/');
    
    // Get the file extension from the type
    const extension = type === 'docx' ? 'docx' : 
                     type === 'pptx' ? 'pptx' : 
                     type === 'txt' ? 'txt' : type;
    
    // Remove any existing extension and add the correct one
    url = url.replace(/\.[^/.]+$/, '');
    url = `${url}.${extension}`;
  }
  return url;
};

// router.post("/upload", auth, upload.single("file"), async (req, res) => {
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { branch, semester, subject, title, type, link, tableData } = req.body;
    console.log('Upload request:', { branch, semester, subject, title, type, link, tableData });
    console.log('Uploaded file details (req.file):', req.file);

    // Get the file extension from the original filename
    const fileExtension = req.file ? req.file.originalname.split('.').pop().toLowerCase() : null;

    const resourceData = {
      branch,
      semester: Number(semester),
      title,
      type,
      link: link || null,
      fileUrl: req.file ? formatCloudinaryUrl(req.file.path, fileExtension) : null,
      cloudinaryId: req.file ? req.file.filename : null
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
    console.error('Upload error:', err);
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
    
    // Format URLs for each resource
    const formattedResources = resources.map(resource => ({
      ...resource.toObject(),
      fileUrl: formatCloudinaryUrl(resource.fileUrl, resource.type)
    }));
    
    console.log('Found resources (before sending to client):', formattedResources); // NEW DEBUG LOG
    
    res.json(formattedResources);
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

    // Delete the file from Cloudinary if it exists
    if (resource.cloudinaryId || resource.fileUrl) {
      try {
        console.log('Deleting file - CloudinaryId:', resource.cloudinaryId, 'FileUrl:', resource.fileUrl);
        await deleteFile(resource.cloudinaryId, resource.fileUrl);
      } catch (err) {
        console.error("Error deleting file from Cloudinary:", err);
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

    // Store old file info for deletion
    const oldCloudinaryId = resource.cloudinaryId;
    const oldFileUrl = resource.fileUrl;

    // Update basic fields from form data
    if (req.body.title) resource.title = req.body.title;
    if (req.body.description !== undefined) resource.description = req.body.description;
    if (req.body.link !== undefined) resource.link = req.body.link;

    // Handle file update if a new file is uploaded
    if (req.file) {
      console.log('New file uploaded:', req.file);
      
      // Update with new file first
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      resource.fileUrl = formatCloudinaryUrl(req.file.path, fileExtension);
      resource.cloudinaryId = req.file.filename;
      
      // Save the resource with new file info
      await resource.save();
      
      // Now delete old file from Cloudinary
      if (oldCloudinaryId || oldFileUrl) {
        try {
          console.log('Deleting old file - CloudinaryId:', oldCloudinaryId, 'FileUrl:', oldFileUrl);
          await deleteFile(oldCloudinaryId, oldFileUrl);
        } catch (err) {
          console.error("Error deleting old file from Cloudinary:", err);
          // Continue even if old file deletion fails
        }
      }
    } else {
      // Just save the updated fields if no new file
      await resource.save();
    }

    res.json({ 
      message: "Resource updated successfully", 
      resource: {
        ...resource.toObject(),
        fileUrl: resource.fileUrl // Cloudinary URL is already complete
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