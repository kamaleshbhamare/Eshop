import { Box, Step, Stepper, StepLabel, CircularProgress, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Input, TextField, } from "@mui/material";
import { useEffect, useState } from "react";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CreateOrder({ selectedCategory }) {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    const { productId, quantity } = location.state || { productId: null, quantity: 1 };
    const [product, setProduct] = useState(null);
    const [addresses, setAddresses] = useState([]);

    const steps = [
        'Items',
        'Select Address',
        'Confirm Order',
    ];

    const [activeStep, setActiveStep] = useState(0);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleOrder = () => {
        // Handle order placement logic here
        console.log(`Order placed for ${quantity} of product ID: ${productId}`);
    }
    const handdleSaveAddress = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const addressData = {
            name: formData.get('name'),
            contactNumber: formData.get('contactNumber'),
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            landmark: formData.get('landmark'),
            zipcode: formData.get('zipCode'),
        };
        console.log("Address data: ", addressData);
        // Save address data to the API using token
        fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addressData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save address');
                }
                return response.json();
            })
            .then(data => {
                console.log('Address saved successfully:', data);
                // Optionally, you can refresh the addresses list after saving
                setAddresses((prevAddresses) => [...prevAddresses, data]);
            })
            .catch(error => {
                console.error('Error saving address:', error);
            });
    }

    // Fetch product details from the API using productId
    useEffect(() => {
        if (!productId) {
            navigate('/products');
        }

        // Fetch order details from the API using productId
        fetch(`https://dev-project-ecommerce.upgrad.dev/api/products/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [productId, quantity]);

    // Fetch all addresses from the API with token
    useEffect(() => {
        console.log("Fetting addresses... with token: ", token);
        fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
            method: 'GET',
            headers: {
                'x-auth-token': token,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch addresses');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                // Filter addresses based on user ID
                // console.log("user.id " + user.id);
                const filteredAddresses = data.filter(address => address.userId === user.id);
                setAddresses(filteredAddresses);
            })
            .catch(error => {
                console.error(error);
            }
            );
    }, [token]);

    // Function to get the content of each step
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <Typography variant="h4">{product.name}</Typography>
                            <Typography variant="subtitle1"  >Quantity: <b>{quantity}</b></Typography>
                            <Typography variant="subtitle1"  >Category: <b>{product.category}</b></Typography>
                            <Typography variant="body1" sx={{ textAlign: 'justify', fontStyle: 'italic' }}>{product.description}</Typography>
                            <Typography variant="h5" color="secondary">₹{product.price}</Typography>
                        </Box>
                    </Paper>
                );
            case 1:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h5">Select Address</Typography>
                        {addresses.length > 0 ? (
                            <FormControl fullWidth>

                                <Select labelId="address-select-label" id="address-select" value="" onChange={() => { }}>
                                    {addresses.map((address) => (
                                        <MenuItem key={address.id} value={address.id}>
                                            <Typography variant="body2" color="textSecondary">
                                                {address.name},
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {address.street}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {address.pincode},
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {address.landmark},
                                                {address.city}
                                            </Typography>
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        ) : (
                            <Typography variant="body1">No addresses available. Please add an address.</Typography>
                        )}
                        <Typography variant="body1" color="textSecondary">
                            Add Address
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} component={Form} noValidate autoComplete="off" onSubmit={handdleSaveAddress}>
                            <TextField label="Name" variant="outlined" />
                            <TextField label="Contact Number" variant="outlined" />
                            <TextField label="Street" variant="outlined" />
                            <TextField label="City" variant="outlined" />
                            <TextField label="State" variant="outlined" />
                            <TextField label="Landmark" variant="outlined" />
                            <TextField label="Zip Code" variant="outlined" />
                            <Button variant="contained" color="primary" onClick={handdleSaveAddress} sx={{ marginTop: 2 }}>
                                Save Address
                            </Button>
                        </Box>

                    </Box>

                );
            case 2:
                return <p>Confirm Order</p>;
            default:
                return null;
        }
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Stepper activeStep={0} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ padding: 2 }}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    getStepContent(activeStep)
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleBack} disabled={activeStep === 0}>
                    Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                </Button>
            </Box>
        </Box>
    );

}