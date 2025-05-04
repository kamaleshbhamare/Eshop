import { Flare, Label } from "@mui/icons-material";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Products = ({ token }) => {
    const [myproducts, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetch('https://dev-project-ecommerce.upgrad.dev/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
                setCategories(data.categories);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 4, padding: 8 }}>
                {myproducts.map(product => (
                    <Card key={product.id} sx={{ minWidth: '275', margin: '10px', padding: '10px' }}>
                        <CardMedia
                            component="img"
                            alt={product.name}
                            height="300"
                            image={product.imageUrl}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                            <Typography variant="h5" component="div" sx={{ textAlign: 'left' }}>
                                {product.name}
                            </Typography>
                            <Typography variant="h6" component="div">
                                ₹{product.price}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', padding: '10px', textAlign: 'justify' }}>
                                {product.description}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
                            <Button variant="contained" color="primary" onClick={() => alert(`Added ${product.name} to cart`)}>
                                Buy
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Box>
        </div>
    )
}

export default Products;