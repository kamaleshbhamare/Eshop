import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async () => {
        try {
            const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            console.log(formData);
            if (!response.ok) {
                throw new Error('Sign up failed');
            }

            const data = await response.json();
            console.log(data);

            // Setting token manually. This is the work around as per the set up document.
            localStorage.setItem('token', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0NDgwMTE3MSwiZXhwIjoxNzQ0ODA5NTcxfQ.x2qwnCYlRPFGaNQftM3yFG1bQf2kGCoBIhWt_gJYBGJZbwCv1rlWMJpbzv0wEQXsSQSJLrH1ugqUvdEe3vo8iA");

            navigate('/products');
            window.location.reload();

        } catch (error) {
            alert('Sign up failed. Please check your credentials.');
        }
    }


    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
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
                <TextField
                    label="First Name *"
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <TextField
                    label="Last Name *"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <TextField
                    label="Email Address *"
                    name="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <TextField
                    label="Password *"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <TextField
                    label="Confirm Password *"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <TextField
                    label="Contact Number *"
                    name="contactNumber"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={(e) => { e.preventDefault(); handleSignUp() }}
                    type="submit"
                    value="Submit"
                >
                    Sign Up
                </Button>
                <Button
                    variant="text"
                    fullWidth
                    color="inherit"
                    sx={{
                        display: "flex",
                        justifyContent: "right",
                        marginLeft: 0,
                        padding: 0,
                        fontSize: 14,
                        mt: 1,
                        textTransform: "none",
                        textDecoration: "underline",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                    onClick={() => navigate('/login')}
                >
                    Already have an account? Sign In
                </Button>
            </Box>
        </form>



    );

}

export default SignUp;