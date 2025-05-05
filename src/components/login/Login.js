import React, { useState } from 'react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {

    const [formData, setFormData] = useState({ username: '', password: '' });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    // Getting login function from AuthContext
    const { login } = useAuth();

    const navigate = useNavigate();

    // Validate the form data before sending it to the server
    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.username)) tempErrors.username = "Enter a valid email";
        if (formData.password.length < 6) tempErrors.password = "Minimum 6 characters";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle login
    const handleLogin = async () => {
        if (!validate()) {
            setApiError("Please fix the errors in the form.");
            return;
        }

        try {
            const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            // console.log(data);

            if (response.ok) {
                login({
                    userData: {
                        id: data.id,
                        email: data.email,
                        role: data.roles[0]
                    },
                    token: data.token
                });
            } else {
                setApiError("Something went wrong. Please try again.");
                throw new Error('Login failed');
            }

            // updateLoginDetails(true);
            // handleRoleChange(data.roles[0]);
            // localStorage.setItem('token', data.token);

            // Setting token manually. This is the work around as per the set up document.
            // localStorage.setItem('token', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0NDgwMTE3MSwiZXhwIjoxNzQ0ODA5NTcxfQ.x2qwnCYlRPFGaNQftM3yFG1bQf2kGCoBIhWt_gJYBGJZbwCv1rlWMJpbzv0wEQXsSQSJLrH1ugqUvdEe3vo8iA");

            // Redirect to products page after successful login
            navigate('/products');

        } catch (error) {
            // alert('Login failed. Please check your credentials.');
            setApiError("Something went wrong. Please try again.");
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <Box maxWidth={400} mx="auto" mt={5} p={3} borderRadius={2} sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }} >
                {apiError && <><Alert severity="error">{apiError}</Alert><br /><br /></>}

                <Box sx={{ alignSelf: 'center', width: 48, height: 48, borderRadius: '50%', backgroundColor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
                    <LockOutlinedIcon sx={{ color: "white" }} variant="filled" />
                </Box>

                <Typography variant="h5" mb={2}>Sign in</Typography>

                <TextField label="Email Address *" name="username" fullWidth margin="normal" onChange={handleChange} error={!!errors.username} helperText={errors.username} />
                <TextField label="Password *" name="password" type="password" fullWidth margin="normal" onChange={handleChange} error={!!errors.password} helperText={errors.password} />

                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={(e) => { e.preventDefault(); handleLogin() }} type="submit" value="Submit">Sign In</Button>
                <Button variant="text" fullWidth color="inherit" sx={{ display: "flex", justifyContent: "left", marginLeft: 0, padding: 0, fontSize: 14, mt: 1, textTransform: "none", textDecoration: "underline", "&:hover": { textDecoration: "underline", }, }} onClick={() => navigate('/signup')} >
                    Don't have an account? Sign Up
                </Button>
            </Box>
        </form >
    );
}