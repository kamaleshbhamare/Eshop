import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

export default function Login({ token }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    console.log(token);
    const handleLogin = async () => {
        try {
            const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log(data);
            // localStorage.setItem('token', data.token);

            // Setting token manually. This is the work around as per the set up document.
            localStorage.setItem('token', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0NDgwMTE3MSwiZXhwIjoxNzQ0ODA5NTcxfQ.x2qwnCYlRPFGaNQftM3yFG1bQf2kGCoBIhWt_gJYBGJZbwCv1rlWMJpbzv0wEQXsSQSJLrH1ugqUvdEe3vo8iA");

            navigate('/products');
            window.location.reload();

        } catch (error) {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <Box maxWidth={400} mx="auto" mt={5} p={3} borderRadius={2}
                sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}
            >
                <Box
                    sx={{
                        alignSelf: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <LockOutlinedIcon sx={{ color: "white" }} variant="filled" />
                </Box>
                <Typography variant="h5" mb={2}>Sign in</Typography>
                <TextField label="Email Address *" name="username" fullWidth margin="normal" onChange={handleChange} />
                <TextField label="Password *" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={(e) => { e.preventDefault(); handleLogin() }} type="submit" value="Submit">Sign In</Button>
                <Button variant="text" fullWidth
                    color="inherit"
                    sx={{
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: 0,
                        padding: 0,
                        fontSize: 14,
                        mt: 1,
                        textTransform: "none",
                        textDecoration: "underline",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }} onClick={() => navigate('/signup')} >Don't have an account? Sign Up</Button>
            </Box>
        </form >
    );
}