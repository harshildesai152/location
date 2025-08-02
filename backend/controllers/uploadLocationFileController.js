const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const unzipper = require('unzipper');
const readline = require('readline');
const pool = require('../config/db'); // Import the database pool


const uploadLocationFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const zipPath = file.path;
  const extractPath = path.join(path.dirname(zipPath), `extract_${Date.now()}`);

  try {
    // 1. Create directory to extract zip
    await fsPromises.mkdir(extractPath, { recursive: true });
    console.log('Created unique extraction directory:', extractPath);

    // 2. Extract zip contents
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    // 3. Find all TXT files in extracted directory
    const files = await fsPromises.readdir(extractPath);
    const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');

    if (txtFiles.length === 0) {
      throw new Error('No .txt files found in the zip');
    }

    // 4. Process first TXT file (can be extended to handle all)
    const locations = [];
    const txtPath = path.join(extractPath, txtFiles[0]);

    const fileStream = fs.createReadStream(txtPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const [name, latitude, longitude] = line.split(',');
      if (name && latitude && longitude) {
        locations.push([
          name.trim(),
          parseFloat(latitude),
          parseFloat(longitude),
          req.user.userId // Make sure req.user is populated via auth middleware
        ]);
      }
    }

    // 5. Insert into DB
    if (locations.length > 0) {
      const insertQuery = 'INSERT INTO locations (name, latitude, longitude, user_id) VALUES ?';
      await pool.query(insertQuery, [locations]);
    }

    res.status(200).json({ message: 'Locations uploaded and stored successfully' });

  } catch (error) {
    console.error('Error during file upload and processing:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    // Cleanup zip and extracted files
    try {
      await fsPromises.rm(zipPath, { force: true });
      await fsPromises.rm(extractPath, { recursive: true, force: true });
      console.log('Cleaned up uploaded zip and extracted files');
    } catch (cleanupErr) {
      console.warn('Cleanup failed:', cleanupErr);
    }
  }
};

module.exports = { uploadLocationFile };
