import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaPlus, FaTrash, FaFileUpload } from 'react-icons/fa'; 
import './MapPage.css'; 
import { useNavigate } from 'react-router-dom'; 


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// // Helper function to get a cookie by name
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// };

function getCookie(name) {
    let cookieArr = document.cookie.split(';');
    
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        
        
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    
    return null;  
}




const MapController = ({ center, zoom }) => {
  const map = useMap(); 

  useEffect(() => {
   
    if (center && map.getCenter().lat !== center[0] || map.getCenter().lng !== center[1] || map.getZoom() !== zoom) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5 
      });
    }
  }, [center, zoom, map]);

  return null;
};

const MapPage = () => {
  const navigate = useNavigate(); 

  const [authToken, setAuthToken] = useState(null); 
  const [locations, setLocations] = useState([]); 

  const [newLocation, setNewLocation] = useState({
    name: '',
    lat: '',
    lng: ''
  });

  
  const [toastMessage, setToastMessage] = useState(null);
  
  const [toastType, setToastType] = useState('success');

  
  const [mapCenter, setMapCenter] = useState([3.1390, 101.6869]);
  const [mapZoom, setMapZoom] = useState(13);

  // Function to show a toast message
  const showToast = (message, type = 'success', duration = 3000) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType('success'); 
    }, duration);
  };


  useEffect(() => {

const token = getCookie('token');
console.log(token, "token is ");
     
    if (token) {
      setAuthToken(token);
    } else {
      console.warn("No authentication token found in cookies. User might not be logged in.");
      showToast("Please log in to manage locations.", "error");
    }
  }, []); 

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
          
        }
        return;
      }

      const data = await response.json();
      const formattedLocations = data.locations.map(loc => ({
        id: loc.id, 
        name: loc.name,
        lat: parseFloat(loc.latitude), 
        lng: parseFloat(loc.longitude) 
      }));
      setLocations(formattedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      showToast('Error fetching locations. Please try again.', 'error');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };
   const handleClick = () => {
    navigate('/');
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
          'Authorization': `Bearer ${authToken}` 
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
            
        }
        return;
      }

      const data = await response.json();
      showToast(data.message, 'success'); 
      setNewLocation({ name: '', lat: '', lng: '' }); 
      fetchLocations(); 
    } catch (error) {
      console.error('Error adding location:', error);
      showToast('Error adding location. Please try again.', 'error');
    }
  };

  
  const handleLocationFocus = (lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(15); 
  };

 
  const handleFileUploadRedirect = () => {
    navigate('/upload');
  };

  return (
    <div className="map-page-container">
   
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
          <h1 className="logo-text"  onClick={handleClick}>LocationHub</h1>
        </div>
        <div className="welcome-section"> {/* Added a wrapper for welcome text and button */}

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
            zoom={mapZoom} 
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
                  click: () => handleLocationFocus(location.lat, location.lng), 
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