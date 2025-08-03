const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const unzipper = require('unzipper');
const readline = require('readline');
const pool = require('../config/db'); 


const uploadLocationFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const zipPath = file.path;
  const extractPath = path.join(path.dirname(zipPath), `extract_${Date.now()}`);

  try {
p
    await fsPromises.mkdir(extractPath, { recursive: true });
    console.log('Created unique extraction directory:', extractPath);

    
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    const files = await fsPromises.readdir(extractPath);
    const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');

    if (txtFiles.length === 0) {
      throw new Error('No .txt files found in the zip');
    }

  
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
          req.user.userId 
        ]);
      }
    }

  
    if (locations.length > 0) {
      const insertQuery = 'INSERT INTO locations (name, latitude, longitude, user_id) VALUES ?';
      await pool.query(insertQuery, [locations]);
    }

    res.status(200).json({ message: 'Locations uploaded and stored successfully' });

  } catch (error) {
    console.error('Error during file upload and processing:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
   
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
