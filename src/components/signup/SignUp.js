import { Alert, Box, Button, TextField, Typography } from "@mui/material";
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

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState("");

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName.trim()) tempErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required";
        if (!emailRegex.test(formData.email)) tempErrors.email = "Enter a valid email";
        if (formData.password.length < 6) tempErrors.password = "Minimum 6 characters";
        if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
        if (!formData.contactNumber.match(/^\d{10,}$/)) { tempErrors.contactNumber = "Enter at least 10 digits"; }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async () => {
        if (validate()) {
            try {
                const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    setSuccess(false);
                    throw new Error('Sign up failed. Please try again!');
                }

                // const data = await response.json();
                // console.log(data);
                setSuccess(true);

                // Setting token manually. This is the work around as per the set up document.
                // localStorage.setItem('token', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0NDgwMTE3MSwiZXhwIjoxNzQ0ODA5NTcxfQ.x2qwnCYlRPFGaNQftM3yFG1bQf2kGCoBIhWt_gJYBGJZbwCv1rlWMJpbzv0wEQXsSQSJLrH1ugqUvdEe3vo8iA");

                // Redirect to sign in page after successful sign up
                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } catch (error) {
                setSuccess(false);
                setApiError(error.message || "Something went wrong.");
            }
        } else {
            setSuccess(false);
            setApiError("Please fix the errors in the form.");
        }
    }


    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            <Box maxWidth={400} mx="auto" mt={5} p={3} borderRadius={2} sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }} >
                {success && <Alert severity="success">Signup successful! Redirecting...</Alert>}
                {apiError && <><Alert severity="error">{apiError}</Alert><br /><br /></>}

                <Box sx={{ alignSelf: 'center', width: 48, height: 48, borderRadius: '50%', backgroundColor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
                    <LockOutlinedIcon sx={{ color: "white" }} variant="filled" />
                </Box>

                <Typography variant="h5" mb={2}>Sign in</Typography>
                <TextField label="First Name *" name="firstName" variant="outlined" fullWidth margin="normal" onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
                <TextField label="Last Name *" name="lastName" variant="outlined" fullWidth margin="normal" onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
                <TextField label="Email Address *" name="email" variant="outlined" fullWidth margin="normal" onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                <TextField label="Password *" name="password" type="password" variant="outlined" fullWidth margin="normal" onChange={handleChange} error={!!errors.password} helperText={errors.password} />
                <TextField label="Confirm Password *" name="confirmPassword" type="password" variant="outlined" fullWidth margin="normal" onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} />
                <TextField label="Contact Number *" name="contactNumber" variant="outlined" fullWidth margin="normal" onChange={handleChange} error={!!errors.contactNumber} helperText={errors.contactNumber} />
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={(e) => { e.preventDefault(); handleSignUp() }} type="submit" value="Submit" >
                    Sign Up
                </Button>
                <Button variant="text" fullWidth color="inherit" sx={{ display: "flex", justifyContent: "right", marginLeft: 0, padding: 0, fontSize: 14, mt: 1, textTransform: "none", textDecoration: "underline", "&:hover": { textDecoration: "underline", }, }} onClick={() => navigate('/login')} >
                    Already have an account? Sign In
                </Button>
            </Box>
        </form>
    );

}

export default SignUp;