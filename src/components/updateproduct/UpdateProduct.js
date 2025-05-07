import { Box, Snackbar, Alert } from "@mui/material";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UpdateProduct = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    manufacturer: "",
    availableItems: "",
    price: "",
    imageUrl: "",
    description: "",
  });

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


  const fetchProductDetails = async () => {
    try {
      console.log("id " + id);
      const apiUrl = `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpdateProduct = async () => {
    try {
      console.log("token " + token);
      const apiUrl = `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/products");
      }, 2000);

    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
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
      <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(); }} >
        <Box maxWidth={400} mx="auto" mt={5} p={3} borderRadius={2} sx={{ alignItems: "center", display: "flex", flexDirection: "column", backgroundColor: "#fff", }} >
          <Typography variant="h5" mb={3}> Modify Product </Typography>
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} > Modify Product </Button>
        </Box>
      </form>
    </>
  );
};

export default UpdateProduct;
