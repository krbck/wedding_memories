const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS
app.use(cors());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/burak/wedding/media/FOTO');
  },
  filename: function (req, file, cb) {
    // Keep original filename but add timestamp to prevent duplicates
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to only allow images and videos
const fileFilter = (req, file, cb) => {
  const isVideo = file.mimetype.startsWith('video/');
  const isImage = file.mimetype.startsWith('image/');

  if (isVideo || isImage) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
});

// API endpoint to get all media files
app.get('/api/media', async (req, res) => {
  try {
    const mediaDir = '/home/burak/wedding/media/FOTO';
    console.log('Reading directory:', mediaDir);
    
    const files = await fs.readdir(mediaDir);
    console.log('Found files:', files);
    
    const mediaFiles = await Promise.all(files.map(async (file) => {
      const filePath = path.join(mediaDir, file);
      const stats = await fs.stat(filePath);
      const isVideo = file.match(/\.(mp4|webm|ogg)$/i);
      const isImage = file.match(/\.(jpg|jpeg|png|gif|webp)$/i);

      if (isVideo || isImage) {
        return {
          id: file,
          type: isVideo ? 'video' : 'image',
          url: `/api/media/${file}`,
          title: file,
          size: stats.size,
          createdAt: stats.birthtime
        };
      }
      return null;
    }));

    const filteredMediaFiles = mediaFiles.filter(file => file !== null);
    res.json(filteredMediaFiles);
  } catch (error) {
    console.error('Error reading media directory:', error);
    res.status(500).json({ error: 'Error reading media directory' });
  }
});

// API endpoint to upload media files
app.post('/api/media', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join('/home/burak/wedding/media/FOTO', req.file.filename);
    const stats = await fs.stat(filePath);
    const isVideo = req.file.filename.match(/\.(mp4|webm|ogg)$/i);
    const isImage = req.file.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    const response = {
      id: req.file.filename,
      type: isVideo ? 'video' : 'image',
      url: `/api/media/${req.file.filename}`,
      title: req.file.originalname,
      size: stats.size,
      createdAt: stats.birthtime
    };

    res.json(response);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Serve media files
app.use('/api/media', express.static('/home/burak/wedding/media/FOTO'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 