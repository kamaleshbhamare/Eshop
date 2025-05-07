import { Box, TextField, Typography, Button, Container, Chip, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function ProductDetails({ selectedCategory }) {


    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const handleOrder = () => {
        navigate("/createorder", { state: { productId: id, quantity: quantity } });
    }

    // Fetch product details from the API using id
    useEffect(() => {
        fetch(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setProduct(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);

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
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <>
            <Container maxWidth="lg" sx={{ display: 'flex', pt: 3, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignSelf: 'center' }} >
                    <ToggleButtonGroup value={selectedCategory} exclusive aria-label="Category" sx={{ mb: 2, display: 'flex', justifyContent: 'center' }} disabled >
                        <ToggleButton value="All" aria-label="All" >
                            All
                        </ToggleButton>
                        {categories.map((category) => (
                            <ToggleButton key={category} value={category} aria-label={category} >
                                {category}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Container>

            <Container sx={{ mt: 4, display: 'flex', }}>
                {/* Left: Product Image */}
                <Box sx={{ flex: '1 1 300px' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxWidth: 400, borderRadius: 8 }} />
                </Box>

                {/* Right: Product Info */}
                < Box sx={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }} >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Typography variant="h4">{product.name}</Typography>
                        <Chip label={"Available Quantity: " + product.availableItems} color="primary"></Chip>
                    </Box>
                    <Typography variant="subtitle1"  >Category: <b>{product.category}</b></Typography>

                    <Typography variant="body1" sx={{ textAlign: 'justify', fontStyle: 'italic' }}>{product.description}</Typography>
                    <Typography variant="h5" color="secondary">₹{product.price}</Typography>

                    <TextField label="Enter Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} sx={{ width: 120 }} />
                    <Button variant="contained" color="primary" onClick={handleOrder} sx={{ width: 150 }}> Place Order </Button>
                </Box>
            </Container >
        </>
    );
}