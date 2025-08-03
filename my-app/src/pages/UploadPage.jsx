import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileAlt, FaMapMarkerAlt, FaDownload } from 'react-icons/fa';
import './UploadPage.css';
import { Link } from "react-router-dom";

const UploadPage = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [countdown, setCountdown] = useState(0); 

    
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000); 
            return () => clearTimeout(timer); 
        } else if (countdown === 0 && uploadMessage.includes('successfully') && !isError) {
            
            navigate('/map');
        }
    }, [countdown, uploadMessage, isError, navigate]); 

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadMessage('');
            setIsError(false);
            setCountdown(0); 
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadMessage('');
            setIsError(false);
            setCountdown(0); 
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleBrowseFilesClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleViewMapClick = () => {
        navigate('/map');
    };
     const handleClick = () => {
    navigate('/');
  };

    const handleDownloadSample = () => {
        const sampleData = "Name,Latitude,Longitude\nSuria KLCC,3.157324,101.712198\nZoo Negara,3.2195416,101.75929564";
        const blob = new Blob([sampleData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_locations.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleUploadFile = async () => {
        if (!selectedFile) {
            setUploadMessage("Please select a file first.");
            setIsError(true);
            return;
        }

        setUploading(true);
        setUploadMessage("Uploading...");
        setIsError(false);
        setCountdown(0); 

        const formData = new FormData();
        formData.append('file', selectedFile);

        const token = getCookie('token');

        try {
            const response = await fetch('http://localhost:3000/api/uploadLocationFile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadMessage(data.message || 'File uploaded successfully!');
                setIsError(false);
                setSelectedFile(null);
                setCountdown(3); 
            } else {
                setUploadMessage(data.message || 'Upload failed.');
                setIsError(true);
                setCountdown(0); 
            }
        } catch (error) {
            console.error('Error during upload:', error);
            setUploadMessage('Network error or server unreachable.');
            setIsError(true);
            setCountdown(0); 
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-page-container">
            <aside className="upload-sidebar">
                <div className="logo-container">
                    <div className="logo-icon">
                        <FaMapMarkerAlt className="icon" />
                    </div>
                    <h1 className="logo-text" onClick={handleClick} style={{ cursor: 'pointer' }}>
                     LocationHub
                    </h1>
                </div>
                <div className="upload-navigation">
                  
                    <nav>
                        <ul>
                            <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/map'); }}>Map</a></li>
                            <li className="active"><a href="/upload" onClick={(e) => { e.preventDefault(); navigate('/upload'); }}>Upload</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="logout-section">
                    <FaFileAlt className="logout-icon" />
                    {/* <span>Logout</span> */}
                </div>
            </aside>

            <main className="upload-main-content">
                <header className="upload-header-content">
                    <h1>Upload Locations</h1>
                    <p>Import multiple locations from a ZIP file containing .txt files</p>
                </header>

                <div className="upload-cards-container">
                  
                    <div className="upload-card file-upload-card">
                        <div className="card-header">
                            <FaUpload className="card-icon" />
                            <h2>File Upload</h2>
                        </div>
                        <p className="card-description">Upload a ZIP file with location data (Name, Latitude, Longitude)</p>

                        <div
                            className={`drop-area ${isDragOver ? 'drag-over' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <FaUpload className="drop-icon" />
                            <p>Drop your ZIP file here</p>
                            <p>or click to browse and select a file</p>
                            <input
                                type="file"
                                id="fileInput"
                                accept=".zip"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <button className="browse-button" onClick={handleBrowseFilesClick}>
                                <FaFileAlt /> Browse Files
                            </button>
                            {selectedFile && <p className="selected-file-name">Selected: {selectedFile.name}</p>}
                        </div>
                        <button
                            className="upload-button"
                            onClick={handleUploadFile}
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        {uploadMessage && (
                            <p className={`upload-message ${isError ? 'error' : 'success'}`}>
                                {uploadMessage}
                                {countdown > 0 && ` Redirecting in ${countdown}...`} {/* Display countdown */}
                            </p>
                        )}
                    </div>

                    <div className="upload-info-cards">
                      
                        <div className="upload-card format-requirements-card">
                            <div className="card-header">
                                <FaFileAlt className="card-icon" />
                                <h2>File Format Requirements</h2>
                            </div>
                            <ul>
                                <li><strong>ZIP File</strong><br />Upload must be a ZIP file containing .txt files</li>
                                <li><strong>Comma Separated</strong><br />Each line in the .txt file: Name, Latitude, Longitude</li>
                                <li><strong>Valid Coordinates</strong><br />Latitude: -90 to 90, Longitude: -180 to 180</li>
                            </ul>
                        </div>

                      
                        <div className="upload-card sample-file-card">
                            <div className="card-header">
                                <FaFileAlt className="card-icon" />
                                <h2>Sample File</h2>
                            </div>
                            <p>Download a sample text file to see the exact format required for your location data.</p>
                            <pre className="sample-data">
                                Name,Latitude,Longitude<br />
                                Suria KLCC,3.157324,101.712198<br />
                                Zoo Negara,3.2195416,101.75929564
                            </pre>
                            <button className="download-sample-button" onClick={handleDownloadSample}>
                                <FaDownload /> Download Sample File
                            </button>
                            <button className="view-map-button" onClick={handleViewMapClick}>
                                View Map
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UploadPage;