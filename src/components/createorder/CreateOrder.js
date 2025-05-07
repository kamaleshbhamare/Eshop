import { Box, Step, Stepper, StepLabel, CircularProgress, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Input, TextField, Alert, Snackbar, } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CreateOrder({ selectedCategory }) {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedAddressId, setSelectedAddressId] = useState('');
    const { productId, quantity } = location.state || { productId: null, quantity: 1 };
    const [product, setProduct] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [showSelectAddressMessage, setShowSelectAddressMessage] = useState(false);
    const [showOrderPlacedMessage, setShowOrderPlacedMessage] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        contactNumber: '',
        street: '',
        city: '',
        state: '',
        landmark: '',
        zipcode: '',
    });

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
        if (activeStep === 1 && !selectedAddressId) {
            setShowSelectAddressMessage(true);
        } if (activeStep === steps.length - 1) {
            handleOrder();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }

    const handleOrder = () => {
        // Handle order placement logic here
        setShowOrderPlacedMessage(true);
    }

    const handleNewAddressChange = (event) => {
        const { name, value } = event.target;
        setNewAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    }

    const validateNewAddress = () => {
        const { name, contactNumber, street, city, state, landmark, zipcode } = newAddress;
        if (!name || !contactNumber || !street || !city || !state || !landmark || !zipcode) {
            alert("Please fill in all fields");
            return false;
        }
        if (contactNumber.length !== 10) {
            alert("Contact number must be 10 digits");
            return false;
        }
        if (zipcode.length !== 6) {
            alert("Zip code must be 6 digits");
            return false;
        }
        return true;
    }

    const handdleSaveAddress = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        console.log("Before validation: ", formData.get('name'), formData.get('contactNumber'), formData.get('street'), formData.get('city'), formData.get('state'), formData.get('landmark'), formData.get('zipcode'));
        const isValid = validateNewAddress();
        console.log("isValid " + isValid);
        if (!isValid) {
            return;
        }
        console.log("Saving address...");
        const addressData = {
            name: formData.get('name'),
            contactNumber: formData.get('contactNumber'),
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            landmark: formData.get('landmark'),
            zipcode: formData.get('zipcode'),
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

    const handleSelectAddressId = (event) => {
        const selectedId = event.target.value;
        setSelectedAddressId(selectedId);
        console.log("Selected address ID: ", selectedId);
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
        console.log("Fetching addresses... with token: ", token);
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
                const filteredAddresses = data.filter(address => address.user === user.id);
                // const filteredAddresses = data;
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

                                <Select value={selectedAddressId} onChange={handleSelectAddressId} displayEmpty>
                                    {addresses.map((address) => (
                                        <MenuItem key={address.id} value={address.id}>
                                            <Typography variant="body2" color="textSecondary" textAlign={'left'}>
                                                {address.name},
                                                {address.street}
                                                {address.pincode},
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} component="form" onSubmit={handdleSaveAddress}>
                            <TextField name="name" label="Name" value={newAddress.name} onChange={handleNewAddressChange} />
                            <TextField name="contactNumber" label="Contact Number" value={newAddress.contactNumber} onChange={handleNewAddressChange} />
                            <TextField name="street" label="Street" value={newAddress.street} onChange={handleNewAddressChange} />
                            <TextField name="city" label="City" value={newAddress.city} onChange={handleNewAddressChange} />
                            <TextField name="state" label="State" value={newAddress.state} onChange={handleNewAddressChange} />
                            <TextField name="landmark" label="Landmark" value={newAddress.landmark} onChange={handleNewAddressChange} />
                            <TextField name="zipcode" label="Zip Code" value={newAddress.zipcode} onChange={handleNewAddressChange} />
                            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                Save Address
                            </Button>
                        </Box>

                    </Box>

                );
            case 2:
                return (
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: 2, flexBasis: '50%' }}>
                            <Typography variant="h4">{product.name}</Typography>

                            <Typography variant="subtitle1"  >Quantity: <b>{quantity}</b></Typography>
                            <Typography variant="subtitle1"  >Category: <b>{product.category}</b></Typography>
                            <Typography variant="body1" sx={{ textAlign: 'justify', fontStyle: 'italic' }}>{product.description}</Typography>

                            <Typography variant="h5" color="secondary">Total: ₹{product.price * quantity}</Typography>

                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: 2, flexBasis: '50%' }}>
                            <Typography variant="h4" >Address Details:</Typography>
                            {addresses.map((address) => {
                                if (address.id === selectedAddressId) {
                                    return (
                                        <>
                                            <Typography key={address.id} variant="body2" color="textSecondary" textAlign={'left'}>
                                                {address.name}
                                            </Typography>
                                            <Typography key={address.id} variant="body2" color="textSecondary" textAlign={'left'}>
                                                {address.street}
                                            </Typography>
                                            <Typography key={address.id} variant="body2" color="textSecondary" textAlign={'left'}>
                                                {address.pincode},
                                            </Typography>
                                            <Typography key={address.id} variant="body2" color="textSecondary" textAlign={'left'}>
                                                {address.landmark},
                                            </Typography>
                                            <Typography key={address.id} variant="body2" color="textSecondary" textAlign={'left'}>
                                                {address.city}
                                            </Typography>
                                        </>
                                    );
                                }
                                return null;
                            })}
                        </Box>
                    </Paper>
                );
            default:
                return null;
        }
    }

    return (
        <Box sx={{ padding: 2 }}>
            {showSelectAddressMessage && (
                <Snackbar open={showSelectAddressMessage} autoHideDuration={6000} onClose={() => { setShowSelectAddressMessage(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert onClose={() => { setShowSelectAddressMessage(false) }} severity="error" variant="filled" sx={{ width: '100%' }} >
                        Please select an address to proceed.
                    </Alert>
                </Snackbar>
            )}
            {showOrderPlacedMessage && (
                <Snackbar open={showOrderPlacedMessage} autoHideDuration={6000} onClose={() => { setShowOrderPlacedMessage(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert onClose={() => { setShowOrderPlacedMessage(false) }} severity="success" variant="filled" sx={{ width: '100%' }} >
                        Order placed successfully!
                    </Alert>
                </Snackbar>
            )}
            <Stepper activeStep={activeStep} alternativeLabel>
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