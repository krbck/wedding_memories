import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import './i18n';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a4a4a', // Dark gray
      light: '#6b6b6b',
      dark: '#2d2d2d',
    },
    secondary: {
      main: '#9e9e9e', // Medium gray
      light: '#bdbdbd',
      dark: '#757575',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
    h1: {
      fontStyle: 'italic',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    h2: {
      fontStyle: 'italic',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    h3: {
      fontStyle: 'italic',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    h4: {
      fontStyle: 'italic',
      fontWeight: 500,
    },
    h5: {
      fontStyle: 'italic',
      fontWeight: 400,
    },
    h6: {
      fontStyle: 'italic',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'none',
          fontStyle: 'italic',
          padding: '10px 30px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
