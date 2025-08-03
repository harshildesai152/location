import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaFileUpload, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); 


const checkAuthStatus = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/check-auth', {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      setIsLoggedIn(true);
    } else {
      console.error('Auth check failed:', data.message);
      setIsLoggedIn(false);
    }
  } catch (error) {
    console.error('Network error:', error);
    setIsLoggedIn(false);
  } finally {
    setLoadingAuth(false);
  }
};

 
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleAuthRedirect = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      navigate('/signup');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', { 
        method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      }
      });

      if (response.ok) {
        setIsLoggedIn(false);
        navigate('/'); 
      } else {
        console.log('Logout failed:', response.statusText);
       
      }
    } catch (error) {
      console.log('Error during logout:', error);
    
    }
  };

  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#3498db'
      }}>
        Loading authentication status...
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      color: '#1a1a1a'
    }}>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '80px',
          padding: '20px 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3498db, #2ecc71)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <FaMapMarkedAlt style={{ color: 'white', fontSize: '20px' }} />
          </div>
          <h1 style={{
            color: '#1a1a1a',
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            margin: 0
          }}>
            LocationHub
          </h1>
        </div>
        <div>
         {isLoggedIn ? (
  <button
    onClick={handleAuthRedirect}
    style={{
      marginRight: '12px',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #ff6b6b, #e74c3c)',
      border: 'none',
      color: 'white',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.95rem',
      boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(231, 76, 60, 0.3)',
        background: 'linear-gradient(135deg, #ff7676, #ff5252)'
      },
      ':active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 4px rgba(231, 76, 60, 0.3)'
      },
      '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: '0.5s'
      },
      ':hover::before': {
        left: '100%'
      }
    }}>
    Logout
  </button>
) : (
  <button
    onClick={handleAuthRedirect}
    style={{
      marginRight: '12px',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #64b5f6, #3498db)',
      border: 'none',
      color: 'white',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.95rem',
      boxShadow: '0 4px 6px rgba(52, 152, 219, 0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(52, 152, 219, 0.3)',
        background: 'linear-gradient(135deg, #82c1ff, #4dabf7)'
      },
      ':active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)'
      },
      '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: '0.5s'
      },
      ':hover::before': {
        left: '100%'
      }
    }}>
    Sign In
  </button>
)}

          <motion.button  
            onClick={() => navigate('/map')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #3498db, #2ecc71)',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)'
            }}
          >
            Get Started
            <FaArrowRight style={{ marginLeft: '8px', fontSize: '14px' }} />
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          textAlign: 'center',
          marginBottom: '100px',
          padding: '0 20px'
        }}
      >
        <motion.h2 variants={itemVariants} style={{
          fontSize: '48px',
          color: '#1a1a1a',
          marginBottom: '24px',
          fontWeight: '800',
          lineHeight: '1.2',
          letterSpacing: '-1px',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Visualize and manage your <span style={{ color: '#3498db' }}>location data</span> with ease
        </motion.h2>
        <motion.p variants={itemVariants} style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Create interactive maps, import locations from files, and collaborate with your team — all in one secure platform.
        </motion.p>
        <motion.div variants={itemVariants}>
          <motion.button
           onClick={() => navigate('/map')}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(52, 152, 219, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #3498db, #2ecc71)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '18px',
              boxShadow: '0 4px 16px rgba(52, 152, 219, 0.3)',
              marginRight: '16px'
            }}
          >
            File Upload
          </motion.button>
          <button
           onClick={() => navigate('/map')}
          style={{
            padding: '16px 32px',
            background: 'none',
            border: '2px solid #eaeaea',
            color: '#1a1a1a',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '18px',
            transition: 'all 0.2s ease',
            ':hover': {
              borderColor: '#3498db',
              color: '#3498db'
            }
          }}>
            Map
          </button>
        </motion.div>
      </motion.div>


      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '100px',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <motion.div variants={itemVariants} style={{ flex: '1', minWidth: '300px' }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            height: '100%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.03)',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 15px 40px rgba(52, 152, 219, 0.15)'
            }
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(52, 152, 219, 0.2))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              color: '#3498db',
              fontSize: '24px'
            }}>
              <FaMapMarkedAlt />
            </div>
            <h3 style={{ color: '#1a1a1a', marginBottom: '20px', fontSize: '22px', fontWeight: '700' }}>Interactive Maps</h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
              Create stunning interactive maps with customizable markers, layers, and real-time updates.
            </p>
            <Link
              to="/map" href="#" style={{
                color: '#3498db',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                ':hover': {
                  color: '#2980b9'
                }
              }}>
              Learn more <FaArrowRight style={{ marginLeft: '8px', fontSize: '14px' }} />
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} style={{ flex: '1', minWidth: '300px' }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            height: '100%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.03)',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 15px 40px rgba(46, 204, 113, 0.15)'
            }
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(46, 204, 113, 0.2))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              color: '#2ecc71',
              fontSize: '24px'
            }}>
              <FaFileUpload />
            </div>
            <h3 style={{ color: '#1a1a1a', marginBottom: '20px', fontSize: '22px', fontWeight: '700' }}>Bulk Import</h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
              Upload CSV, Excel, or ZIP files to import thousands of locations in seconds with our smart importer.
            </p>
            <Link
              to="/upload"
              style={{
                color: '#3498db',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontSize: { xs: '14px', sm: '16px' }
              }}
            >
              Learn more <FaArrowRight style={{ marginLeft: '8px', fontSize: '14px' }} />
            </Link>
          </div>
        </motion.div>

       
           
        
       
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, #3498db, #2ecc71)',
          padding: '60px 40px',
          borderRadius: '16px',
          marginBottom: '60px',
          color: 'white',
          boxShadow: '0 15px 40px rgba(52, 152, 219, 0.3)'
        }}
      >
        <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '700' }}>Ready to transform your location data?</h2>
        <p style={{
          fontSize: '18px',
          marginBottom: '30px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Join thousands of businesses already using LocationHub to visualize, analyze, and share their location data.
        </p>
        {/* <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'white', color: '#3498db' }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '16px 32px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid white',
            color: 'white',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '18px',
            transition: 'all 0.3s ease'
          }}
        >
          Create Your Free Account
        </motion.button> */}
      </motion.div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '40px 0',
        color: '#666',
        fontSize: '14px',
        borderTop: '1px solid #eee'
      }}>
       
      </div>
    </div>
  );
};

export default Home;