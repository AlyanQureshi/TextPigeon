import { React, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import validator from "validator";

const cookies = new Cookies();

const initialState = {
    fullName: '',
    email: '',
    username: '',
    username_email: '',
    password: '',
    confirmPassword: '',
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const switchMode = () => {
        setIsSignup((prevSignup) => !prevSignup);
        setError(false);
        setErrorMessage("");
        setForm(initialState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, confirmPassword, email, username_email } = form;

        const URL = "http://localhost:5000/auth";
    
        if (isSignup) {
            if (password !== confirmPassword) {
                setError(true);
                setErrorMessage("Signup Error: Passwords do not match.");
            } else if (!validator.isEmail(email)) {
                setError(true);
                setErrorMessage("Signup Error: Email is not in a valid format.");
            } else {
                try {
                    const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/signup`, {
                        username, fullName: form.fullName, password, email
                    })
    
                    cookies.set('token', token);
                    cookies.set('username', form.username);
                    cookies.set('fullName', fullName);
                    cookies.set('userId', userId);
                    cookies.set('hashedPassword', hashedPassword);
    
                    window.location.reload();
                } catch (error) {
                    setError(true);
                    setErrorMessage(`Signup Error: ${error.response?.data?.message}`);
                }
            }
        } else {
            try {
                const response = await axios.post(`${URL}/login`, {
                    username_email, password
                });
    
                const { token, userId, fullName, username } = response.data;
    
                cookies.set('token', token);
                cookies.set('username', username);
                cookies.set('fullName', fullName || form.fullName);
                cookies.set('userId', userId);

                window.location.reload();
                
            } catch (error) {
                setError(true);
                setErrorMessage(`Login Error: ${error.response?.data?.message}`);
            }
        }  
    }

    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input 
                                    name="fullName" 
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="email">Email</label>
                                <input 
                                    name="email" 
                                    type="text"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="username">Username</label>
                                <input 
                                    name="username" 
                                    type="text"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {!isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="username_email">Username or Email</label>
                                <input 
                                    name="username_email" 
                                    type="text"
                                    placeholder="Username or Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                                <input 
                                    name="password" 
                                    type="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>  
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            )}
                            { error && <div style={{ color:"red" }}>{errorMessage}</div>}
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Sign Up" : "Sign In"}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup ? "Already have an account?" : "Don't have an account?"}
                             <span onClick={switchMode} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                {isSignup ? 'Sign In' : 'Sign Up'}
                             </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
