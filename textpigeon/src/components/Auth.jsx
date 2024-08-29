import { React, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import validator from "validator";
import Typography from '@mui/material/Typography';

const cookies = new Cookies();

const initialState = {
    form_fullName: '',
    form_email: '',
    form_username: '',
    username_email: '',
    form_password: '',
    form_confirmPassword: '',
    ver_code: ''
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [verification, setVerification] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [code, setCode] = useState("");
    const [username, setUsername] = useState("");
    const [acc_fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    

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

        const { form_username, form_password, form_confirmPassword, form_email, username_email, form_fullName } = form;

        const URL =
            process.env.NODE_ENV === "production"
                ? "/auth"
                : "http://localhost:5000/auth";

        if (isSignup) {
            if (!verification && (form_password !== form_confirmPassword)) {
                setError(true);
                setErrorMessage("Signup Error: Passwords do not match.");
            } else if (!verification && (!validator.isEmail(form_email))) {
                setError(true);
                setErrorMessage("Signup Error: Email is not in a valid format.");
            } else {
                if (!verification) {
                    const { data: { verification_code } } = await axios.post(`${URL}/verification`, {
                        email: form_email
                    });

                    // Holding important form info for later
                    setUsername(form_username);
                    setFullName(form_fullName);
                    setPassword(form_password);
                    setEmailAddress(form_email);

                    // Getting ready for verification step
                    setCode(verification_code);
                    setError(false);
                    setErrorMessage("");
                    setVerification(true);
                } else {
                    const { ver_code } = form;

                    if (code.toString() === ver_code.toString()) {
                        try {
                            const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/signup`, {
                                username, fullName: acc_fullName, password, email: emailAddress
                            })
            
                            cookies.set('token', token);
                            cookies.set('username', username);
                            cookies.set('fullName', fullName);
                            cookies.set('userId', userId);
                            cookies.set('hashedPassword', hashedPassword);
            
                            window.location.reload();
                        } catch (error) {
                            setCode("");
                            setEmailAddress("");
                            setVerification(false);
                            setError(true);
                            setErrorMessage(`Signup Error: ${error.response?.data?.message}`);
                        }
                    } else {
                        setCode("");
                        setError(true);
                        setErrorMessage("Signup Error: Verification code was wrong.");
                        setEmailAddress("");
                        setVerification(false);
                    }
                }
            }
        } else {
            try {
                const response = await axios.post(`${URL}/login`, {
                    username_email, password: form_password
                });
    
                const { token, userId, fullName, username } = response.data;
    
                cookies.set('token', token);
                cookies.set('username', username);
                cookies.set('fullName', fullName);
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
                <Typography variant="h2" gutterBottom className='text-center fw-lighter' 
                    sx={{ color: "white", marginBottom: "40px" }}
                >
                    Text Pigeon
                </Typography>
                <div className="auth__form-container_fields-content">
                    <p>{verification ? ('Verification Code') : (isSignup ? 'Sign Up' : 'Sign In')}</p>
                    <form onSubmit={handleSubmit}>
                        {!verification && (isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="form_fullName">Full Name</label>
                                <input 
                                    name="form_fullName" 
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        {verification && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="ver_code">
                                    A verification code was sent to <span style={{ textDecoration: "bold" }}>{emailAddress}</span>. 
                                    Enter it below to verify this email address.
                                </label>
                                <input 
                                    name="ver_code" 
                                    type="text"
                                    placeholder="6-digit Code"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {!verification && (isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="form_email">Email</label>
                                <input 
                                    name="form_email" 
                                    type="text"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        {!verification && (isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="form_username">Username</label>
                                <input 
                                    name="form_username" 
                                    type="text"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        {!verification && (!isSignup && (
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
                        ))}
                        {!verification && (<div className="auth__form-container_fields-content_input">
                            <label htmlFor="form_password">Password</label>
                                <input 
                                    name="form_password" 
                                    type="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>)}  
                        {!verification && (isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="form_confirmPassword">Confirm Password</label>
                                <input 
                                    name="form_confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        { error && <div style={{ color:"red" }}>{errorMessage}</div>}
                        <div className="auth__form-container_fields-content_button">
                            <button>{verification ? ("Verify") : (isSignup ? "Sign Up" : "Sign In")}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {verification ? ('The verification code may take a few minutes to send.') 
                                : (isSignup ? "Already have an account?" : "Don't have an account?")}
                            <span onClick={switchMode} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                {verification ? ("") : (isSignup ? 'Sign In' : 'Sign Up')}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
