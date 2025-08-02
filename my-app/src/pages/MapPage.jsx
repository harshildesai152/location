import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaPlus, FaTrash, FaFileUpload } from 'react-icons/fa'; // Import FaFileUpload
import './MapPage.css'; // Assuming your CSS is in MapPage.css
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// Fix for default marker icons - ESSENTIAL for Leaflet to display markers correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Helper function to get a cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Component to control the map's view (zoom and center)
const MapController = ({ center, zoom }) => {
  const map = useMap(); // Get the Leaflet map instance

  useEffect(() => {
    // Only update view if the center or zoom has genuinely changed
    // or if the map needs to be re-rendered to this specific view.
    // Using `flyTo` for a smoother animation.
    if (center && map.getCenter().lat !== center[0] || map.getCenter().lng !== center[1] || map.getZoom() !== zoom) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5 // Animation duration in seconds
      });
    }
  }, [center, zoom, map]);

  return null; // This component doesn't render anything itself
};

const MapPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [authToken, setAuthToken] = useState(null); // Token will be fetched from cookies
  const [locations, setLocations] = useState([]); // Initialize as empty, fetch from API

  const [newLocation, setNewLocation] = useState({
    name: '',
    lat: '',
    lng: ''
  });

  // State for the toast message
  const [toastMessage, setToastMessage] = useState(null);
  // State for the toast type (e.g., 'success', 'error') - useful for styling
  const [toastType, setToastType] = useState('success');

  // Initial map center - Can be updated dynamically if needed
  const [mapCenter, setMapCenter] = useState([3.1390, 101.6869]); // Default to Kuala Lumpur
  const [mapZoom, setMapZoom] = useState(13); // Default zoom level

  // Function to show a toast message
  const showToast = (message, type = 'success', duration = 3000) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType('success'); // Reset to default type
    }, duration);
  };

  // Effect to retrieve the authentication token from cookies on component mount
  useEffect(() => {
    const token = getCookie('token');
    console.log(token, "dddddd");
     // Assuming your cookie name is 'token'
    if (token) {
      setAuthToken(token);
    } else {
      console.warn("No authentication token found in cookies. User might not be logged in.");
      showToast("Please log in to manage locations.", "error");
    }
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch locations from the backend
  const fetchLocations = async () => {
    if (!authToken) {
      console.log("Authentication token not available yet or missing. Skipping fetchLocations.");
      setLocations([]); // Clear locations if token is not available
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/getLocation', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Pass the token in the header
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch locations:', errorData.message);
        showToast(`Failed to load locations: ${errorData.message}`, 'error');
        if (response.status === 401 || response.status === 403) {
            // In a real app, you'd likely clear the token and redirect to login
        }
        return;
      }

      const data = await response.json();
      const formattedLocations = data.locations.map(loc => ({
        id: loc.id, // Assuming your DB table has an 'id' column
        name: loc.name,
        lat: parseFloat(loc.latitude), // Ensure they are numbers
        lng: parseFloat(loc.longitude)  // Ensure they are numbers
      }));
      setLocations(formattedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      showToast('Error fetching locations. Please try again.', 'error');
    }
  };

  // Fetch locations when the authToken becomes available or changes
  useEffect(() => {
    fetchLocations();
  }, [authToken]); // Dependency array: re-run when authToken changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocation.name || !newLocation.lat || !newLocation.lng) {
      showToast('Please fill in all fields for the new location.', 'error');
      return;
    }
    if (isNaN(parseFloat(newLocation.lat)) || isNaN(parseFloat(newLocation.lng))) {
        showToast('Latitude and Longitude must be valid numbers.', 'error');
        return;
    }
    if (!authToken) {
        showToast('Authentication token is missing. Please log in to add locations.', 'error');
        return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/addLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Pass the token
        },
        body: JSON.stringify({
          name: newLocation.name,
          latitude: parseFloat(newLocation.lat),
          longitude: parseFloat(newLocation.lng)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add location:', errorData.message);
        showToast(`Failed to add location: ${errorData.message}`, 'error');
        if (response.status === 401 || response.status === 403) {
            // In a real app, you'd likely clear the token and redirect to login
        }
        return;
      }

      const data = await response.json();
      showToast(data.message, 'success'); // Show success toast
      setNewLocation({ name: '', lat: '', lng: '' }); // Clear form
      fetchLocations(); // Re-fetch locations to update the map and list
    } catch (error) {
      console.error('Error adding location:', error);
      showToast('Error adding location. Please try again.', 'error');
    }
  };

  // This function is now responsible for updating both mapCenter and mapZoom
  const handleLocationFocus = (lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(15); // Adjust zoom level as desired when focusing on a location
  };

  // Function to handle redirection to the upload page
  const handleFileUploadRedirect = () => {
    navigate('/upload');
  };

  return (
    <div className="map-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification toast-${toastType}`}>
          {toastMessage}
        </div>
      )}

      <header className="map-header">
        <div className="logo-container">
          <div className="logo-icon">
            <FaMapMarkerAlt className="icon" />
          </div>
          <h1 className="logo-text">LocationHub</h1>
        </div>
        <div className="welcome-section"> {/* Added a wrapper for welcome text and button */}
          <div className="welcome-text">Welcome, John Dee</div>
          <button className="file-upload-button" onClick={handleFileUploadRedirect}>
            <FaFileUpload /> Upload File
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="add-location-card">
            <h2>Add Location</h2>
            <p className="description">
              Enter location details to add a new marker to your map.
            </p>

            <form onSubmit={handleAddLocation}>
              <div className="form-group">
                <label>Location Name</label>
                <input
                  type="text"
                  name="name"
                  value={newLocation.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Suria KLCC"
                  required
                />
              </div>

              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={newLocation.lat}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.157324"
                  required
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={newLocation.lng}
                  onChange={handleInputChange}
                  placeholder="e.g., 101.712198"
                  required
                />
              </div>

              <button type="submit" className="add-button">
                <FaPlus /> Add to Map
              </button>
            </form>
          </div>

          <div className="locations-list">
            <h2>Your Locations ({locations.length})</h2>

            <div className="locations-container">
              {locations.length > 0 ? (
                locations.map(location => (
                  <div
                    key={location.id}
                    className="location-item"
                    onClick={() => handleLocationFocus(location.lat, location.lng)} // Use handleLocationFocus here
                  >
                    <div className="location-info">
                      <div className="location-name">{location.name}</div>
                      <div className="location-coords">
                        Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                      </div>
                    </div>
                    {/* You can add a delete button here if needed */}
                    {/* <button className="delete-button" onClick={() => handleDeleteLocation(location.id)}>
                        <FaTrash />
                    </button> */}
                  </div>
                ))
              ) : (
                <p>No locations added yet. Add some above!</p>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom} // Use mapZoom state
            className="leaflet-container"
            whenReady={(map) => { /* Optional: do something when map is ready */ }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Add the MapController component inside MapContainer */}
            <MapController center={mapCenter} zoom={mapZoom} />

            {locations.map(location => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                eventHandlers={{
                  click: () => handleLocationFocus(location.lat, location.lng), // Also call handleLocationFocus on marker click
                }}
              >
                <Popup>
                  <div className="popup-name">{location.name}</div>
                  <div>Lat: {location.lat.toFixed(6)}</div>
                  <div>Lng: {location.lng.toFixed(6)}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <footer className="map-footer">
        <p>© {new Date().getFullYear()} LocationHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MapPage;