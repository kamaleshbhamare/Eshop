import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AddProduct = () => {
    const { token } = useAuth();

    const [product, setProduct] = useState({
        name: "",
        category: "",
        manufacturer: "",
        availableItems: "",
        price: "",
        imageUrl: "",
        description: "",
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Fetch categories from the API
    useEffect(() => {
        fetch('https://dev-project-ecommerce.upgrad.dev/api/products/categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                return response.json();
            })
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async () => {


        const apiUrl = 'https://dev-project-ecommerce.upgrad.dev/api/products';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Product added successfully:', data);
                alert('Product added successfully!');
                setProduct({
                    name: '',
                    price: '',
                    description: '',
                    category: '',
                    stock: '',
                });
            } else {
                const errorData = await response.json();
                console.error('Error adding product:', errorData);
                alert('Failed to add product. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <>
            {showSuccess && (
                <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => { setShowSuccess(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert onClose={() => { setShowSuccess(false) }} severity="success" variant="filled" sx={{ width: '100%' }} >
                        Product updated successfully!
                    </Alert>
                </Snackbar>)
            }

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} >
                <Box maxWidth={400} mx="auto" mt={5} p={3} borderRadius={2} sx={{ alignItems: "center", display: "flex", flexDirection: "column", backgroundColor: "#fff", }} >
                    <Typography variant="h5" mb={3}> Add Product </Typography>
                    <TextField label="Name" required name="name" value={product.name} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField select required label="Category" name="category" value={product.category} onChange={handleInputChange} fullWidth margin="normal" textAlign="left" >
                        <MenuItem value="" textAlign="left">Select Category</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category} textAlign="left" >
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Manufacturer" required name="manufacturer" value={product.manufacturer} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Available Items" required name="availableItems" type="number" value={product.availableItems} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Price" name="price" type="number" value={product.price} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Image URL" name="imageUrl" value={product.imageUrl} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Description" name="description" value={product.description} onChange={handleInputChange} fullWidth margin="normal" multiline rows={4} />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} > Add Product </Button>
                </Box>
            </form>
        </>
    );
};

export default AddProduct;