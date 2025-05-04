import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // blue by default — change to your color
        },
        secondary: {
            main: '#ff4081', // pink by default — change to your color
        },
    },
});

export default theme;