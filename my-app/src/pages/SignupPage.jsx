// src/components/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'sonner'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faUserAlt } from '@fortawesome/free-solid-svg-icons';

import './SignupPage.css'; 

const SignupPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate(); 

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setLoading(true); // Start loading

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: fullName,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) { 
                toast.success(data.message || 'Signup successful!');
                
                setTimeout(() => {
                    navigate('/login'); 
                }, 1500); 
            } else {
                
                toast.error(data.message || 'Signup failed. ' + (data.message || 'Please try again.'));
            }
        } catch (error) {
            console.error('Error during signup:', error);
            
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                toast.error('Network error: Could not connect to the server. Please ensure the backend is running and accessible.');
            } else {
                toast.error('An unexpected error occurred during signup.');
            }
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="signup-page-container">
            {/* Top Header Bar */}
            {/* <div className="top-header-bar">
                {/* You can add a logo or title here 
            </div> */}

            <div className="signup-main-content">
                <div className="signup-card">
                    <div className="signup-icon">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <h2 className="signup-title">Create Account</h2>
                    <p className="signup-subtitle">Join LocationHub to start managing your locations</p>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <div className="input-wrapper">
                                <FontAwesomeIcon icon={faUserAlt} className="input-icon" />
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <FontAwesomeIcon icon={faLock} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEye : faEyeSlash}
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrapper">
                                <FontAwesomeIcon icon={faLock} className="input-icon" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading} 
                                />
                                <FontAwesomeIcon
                                    icon={showConfirmPassword ? faEye : faEyeSlash}
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="create-account-button" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="signup-footer">
                        Already have an account? <a href="/login" className="signin-link">Sign in here</a>
                    </p>
                </div>
            </div>
           
        </div>
    );
};

export default SignupPage;