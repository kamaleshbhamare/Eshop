import { AppBar, Button, Toolbar, Box, InputBase } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import './NavigationBar.css';

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

export const NavigationBar = ({ setSearchTerm }) => {
    const navigate = useNavigate();
    const { isLoggedIn, logout, user } = useAuth();

    const handleLogin = () => {
        navigate('/login'); // Redirect to login page
    }

    const handleLogout = () => {
        // localStorage.removeItem('token'); // Clear token
        logout(); // Update context state
        navigate('/login'); // Redirect to login page
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: "primary" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center" gap={1} onClick={() => navigate("/products")} sx={{ cursor: "pointer" }}>
                    <ShoppingCartIcon />
                    <span className="logo-text">upGrad E-Shop</span>
                </Box>
                {isLoggedIn && <Search sx={{ display: { xs: "none", md: "flex", minWidth: 400 } }}>
                    <SearchIconWrapper> <SearchIcon /> </SearchIconWrapper>
                    <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} onChange={(event) => { setSearchTerm(event.target.value) }} />
                </Search>}
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    {
                        isLoggedIn &&
                        <a href="#" className="nav_link" onClick={() => navigate("/products")} >
                            Home
                        </a>
                    }
                    {
                        isLoggedIn && user?.role === "ADMIN" &&
                        <a href="#" className="nav_link" onClick={() => navigate("/addproduct")} >
                            Add Product
                        </a>
                    }
                    {
                        !isLoggedIn && <Button variant="contained" color="secondary" onClick={handleLogin}>
                            Login
                        </Button>
                    }
                    {
                        isLoggedIn && <Button variant="contained" color="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    }
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
