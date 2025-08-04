const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const unzipper = require('unzipper');
const readline = require('readline');
const pool = require('../config/db');

const uploadLocationFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const zipPath = file.path;
  const extractPath = path.join(path.dirname(zipPath), `extract_${Date.now()}`);

  try {
    await fsPromises.mkdir(extractPath, { recursive: true });

    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    const files = await fsPromises.readdir(extractPath);
    const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');

    //  multiple .txt files not allowd
    if (txtFiles.length === 0) {
      throw new Error('No .txt files found in the zip. Please include one .txt file.');
    }

    if (txtFiles.length > 1) {
      return res.status(400).json({
        message: 'Multiple .txt files found. Only one is allowed.'
      });
    }

    const locations = [];
    const errors = [];
    const txtPath = path.join(extractPath, txtFiles[0]);

    const fileStream = fs.createReadStream(txtPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;
    for await (const line of rl) {
      lineNumber++;
      const parts = line.split(',');
      let lineErrors = [];

      if (parts.length !== 3) {
        lineErrors.push("Missing data. Expected 'Name,Latitude,Longitude'.");
      } else {
        const [name, latitudeStr, longitudeStr] = parts;
        const trimmedName = name.trim();
        const parsedLatitude = parseFloat(latitudeStr);
        const parsedLongitude = parseFloat(longitudeStr);

        if (!trimmedName) {
          lineErrors.push('Name is missing.');
        }
        if (isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90) {
          lineErrors.push('Invalid Latitude. Must be -90 to 90.');
        }
        if (isNaN(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180) {
          lineErrors.push('Invalid Longitude. Must be -180 to 180.');
        }
      }

      if (lineErrors.length > 0) {
        errors.push(`Line ${lineNumber}: ${lineErrors.join(' ')}`);
        continue;
      }

      locations.push([
        parts[0].trim(),
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        req.user.userId
      ]);
    }


    let mainErrorMessage = 'File contains format errors.';
    if (errors.length > 0) {
      const hasNameError = errors.some(err => err.includes('Name is missing.'));
      const hasLatitudeError = errors.some(err => err.includes('Invalid Latitude.'));
      const hasLongitudeError = errors.some(err => err.includes('Invalid Longitude.'));
      const hasMissingDataError = errors.some(err => err.includes("Missing data. Expected 'Name,Latitude,Longitude'."));

      if (hasMissingDataError) {
        mainErrorMessage = 'File format error: Each line must have Name,Latitude,Longitude.';
      } else if (hasNameError && hasLatitudeError && hasLongitudeError) {
        mainErrorMessage = 'Missing Name, Latitude, and Longitude in some lines.';
      } else if (hasNameError && hasLatitudeError) {
        mainErrorMessage = 'Missing Name and Latitude in some lines.';
      } else if (hasNameError && hasLongitudeError) {
        mainErrorMessage = 'Missing Name and Longitude in some lines.';
      } else if (hasLatitudeError && hasLongitudeError) {
        mainErrorMessage = 'Missing Latitude and Longitude in some lines.';
      } else if (hasNameError) {
        mainErrorMessage = 'Name is required in some lines.';
      } else if (hasLatitudeError) {
        mainErrorMessage = 'Latitude is required and must be valid in some lines.';
      } else if (hasLongitudeError) {
        mainErrorMessage = 'Longitude is required and must be valid in some lines.';
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: mainErrorMessage,
        errors: errors
      });
    }

    if (locations.length === 0) {
      return res.status(400).json({ message: 'The uploaded file contains no valid location data.' });
    }

    const insertQuery = 'INSERT INTO locations (name, latitude, longitude, user_id) VALUES ?';
    await pool.query(insertQuery, [locations]);

    res.status(200).json({ message: 'Locations uploaded and stored successfully.' });

  } catch (error) {
    console.error('Error during file upload and processing:', error);

    if (error.message.includes('No .txt files found')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error during file processing. Please try again.' });

  } finally {
    try {
      await fsPromises.rm(zipPath, { force: true });
      await fsPromises.rm(extractPath, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.warn('Cleanup failed:', cleanupErr);
    }
  }
};

module.exports = { uploadLocationFile };
