import { React, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);
    const [mismatchedPassword, setMismatchedPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const switchMode = () => {
        setIsSignup(!isSignup);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, username, password, confirmPassword } = form;

        const URL = "http://localhost:5000/auth";

        if (isSignup) {
            if (password !== confirmPassword) {
                setMismatchedPassword(true);
            } else {
                const { data: { token, userId, hashedPassword } } = await axios.post(`${URL}/signup`, {
                    username, fullName, password
                })

                cookies.set('token', token);
                cookies.set('username', username);
                cookies.set('fullName', fullName);
                cookies.set('userId', userId);
                cookies.set('hashedPassword', hashedPassword);

                window.location.reload();
            }
        } else {
            const { data: { token, userId } } = await axios.post(`${URL}/login`, {
                username, password
            })

            cookies.set('token', token);
            cookies.set('username', username);
            cookies.set('fullName', fullName);
            cookies.set('userId', userId);

            window.location.reload();
            
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
                            { mismatchedPassword && <div style={{ color:"red" }}>Error. Passwords do not match.</div>}
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
