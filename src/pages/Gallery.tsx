import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia,
  AppBar,
  Toolbar,
  Link,
  Paper,
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

// This will be replaced with actual data from backend later
const mockGalleryItems = [
  {
    id: 1,
    type: 'image',
    url: 'https://source.unsplash.com/random/800x600?wedding',
    title: 'Wedding Photo 1'
  },
  {
    id: 2,
    type: 'image',
    url: 'https://source.unsplash.com/random/800x600?wedding',
    title: 'Wedding Photo 2'
  },
  {
    id: 3,
    type: 'image',
    url: 'https://source.unsplash.com/random/800x600?wedding',
    title: 'Wedding Photo 3'
  }
];

function Gallery() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
    }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
            {t('common.weddingTitle')}
          </Typography>
          <IconButton 
            onClick={toggleLanguage} 
            sx={{ 
              color: 'primary.main',
              mr: 2,
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease'
              }
            }}
          >
            <LanguageIcon />
          </IconButton>
          <Link component={RouterLink} to="/" color="primary" underline="none" sx={{ 
            '&:hover': { 
              color: 'primary.dark',
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease'
            }
          }}>
            {t('nav.home')}
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          textAlign: 'center',
          maxWidth: '1200px'
        }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            mb: 6,
            background: 'linear-gradient(45deg, #4a4a4a 30%, #757575 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('gallery.title')}
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {mockGalleryItems.map((item) => (
              <Card key={item.id} sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                }
              }}>
                <CardMedia
                  component={item.type === 'image' ? 'img' : 'video'}
                  height="300"
                  image={item.url}
                  alt={item.title}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
              </Card>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Gallery; 