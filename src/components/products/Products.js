import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Card, CardMedia, Container, MenuItem, Select, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Products = ({ searchTerm, setSelectedCategoryRoot }) => {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    const [defaultProducts, setDefaultProducts] = useState([]);
    const [myproducts, setMyProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSortOption, setSelectedSortOption] = useState();

    const sortOptions = [
        { value: 'default', label: 'Default' },
        { value: 'priceLowToHigh', label: 'Price: Low to High' },
        { value: 'priceHighToLow', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest' },
    ];

    // Fetch products and categories from the API
    useEffect(() => {
        // Fetch products from the API        
        fetch('https://dev-project-ecommerce.upgrad.dev/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then(data => {
                setDefaultProducts(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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

    // Filter products based on selected category
    useEffect(() => {
        let updatedProducts = [...defaultProducts];

        if (selectedCategory !== 'All') {
            updatedProducts = updatedProducts.filter(product => product.category === selectedCategory);
        }

        updatedProducts.sort((a, b) => {
            if (selectedSortOption === 'default') {
                return a.id - b.id;
            } else if (selectedSortOption === 'priceLowToHigh') {
                return a.price - b.price;
            } else if (selectedSortOption === 'priceHighToLow') {
                return b.price - a.price;
            } else if (selectedSortOption === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });

        // Filter products based on search term
        if (searchTerm) {
            updatedProducts = updatedProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setMyProducts(updatedProducts);

    }, [selectedSortOption, selectedCategory, defaultProducts, searchTerm]);

    // Handle sort option change
    const handleSort = (event) => {
        const value = event.target.value;
        setSelectedSortOption(value);
    };

    const handleEditProduct = (productId) => {
        navigate(`/updateproduct/${productId}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }

    if (!isLoggedIn) {
        navigate('/login'); // Redirect to login page if not logged in
        return null; // Prevent rendering the component
    }

    return (
        <div>
            <Container maxWidth="lg" sx={{ display: 'flex', pt: 3, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignSelf: 'center' }} >
                    <ToggleButtonGroup value={selectedCategory} exclusive onChange={(event, newCategory) => { if (newCategory !== null) { setSelectedCategory(newCategory); setSelectedCategoryRoot(newCategory); } }} aria-label="Category" sx={{ mb: 2, display: 'flex', justifyContent: 'center' }} >
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
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', }} >
                <Typography>
                    Sort By:
                </Typography>
                <Select value={selectedSortOption} onChange={handleSort} sx={{ minWidth: 230, textAlign: 'left' }} defaultValue="default" >
                    {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </Container>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 4, p: 4, }} >
                {myproducts.filter(product => selectedCategory === 'All' || product.category === selectedCategory).map((product) => (
                    // {myproducts.map((product) => (
                    <Card key={product.id} sx={{ minWidth: 275, p: 2, position: 'relative', display: 'flex', flexDirection: 'column', height: 480, }} >
                        <CardMedia component="img" alt={product.name} height="200" image={product.imageUrl} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', mt: 2 }}>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="h6">₹{product.price}</Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'justify', flexGrow: 1 }} >
                            {product.description}
                        </Typography>

                        {/* Bottom-aligned button row */}
                        <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', }} >
                            {/* Buy button aligned left */}
                            <Button variant="contained" color="primary" onClick={() => navigate("/products/" + product.id)} >
                                Buy
                            </Button>

                            {/* Admin controls aligned right */}
                            {isLoggedIn && user?.role === "ADMIN" && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Edit color="action" sx={{ cursor: 'pointer' }} onClick={() => handleEditProduct(product.id)} />
                                    <Delete color="action" sx={{ cursor: 'pointer' }} onClick={() => alert(`Delete ${product.name}`)} />
                                </Box>
                            )}
                        </Box>
                    </Card>
                ))}
            </Box>
        </div >
    )
}

export default Products;