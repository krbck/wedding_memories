import { useState, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia,
  AppBar,
  Toolbar,
  Link,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Modal,
  IconButton as MuiIconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import { GalleryContext } from '../App';
import { UploadMedia } from '../components/UploadMedia';

interface SelectedMedia {
  type: 'image' | 'video';
  url: string;
  title: string;
}

function Gallery() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { galleryItems, isLoading, error } = useContext(GalleryContext);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageMenuClose();
  };

  const handleMediaClick = (item: SelectedMedia) => {
    setSelectedMedia(item);
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
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
            onClick={handleLanguageMenuOpen}
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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageMenuClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 2,
                mt: 1.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }
            }}
          >
            <MenuItem onClick={() => handleLanguageChange('tr')} sx={{ 
              fontStyle: 'italic',
              color: i18n.language === 'tr' ? 'primary.main' : 'inherit'
            }}>
              TR
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('en')} sx={{ 
              fontStyle: 'italic',
              color: i18n.language === 'en' ? 'primary.main' : 'inherit'
            }}>
              ENG
            </MenuItem>
          </Menu>
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
        py: 2,
        px: { xs: 1, sm: 2 }
      }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          textAlign: 'center',
          maxWidth: '1400px'
        }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            mb: 4,
            background: 'linear-gradient(45deg, #4a4a4a 30%, #757575 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('gallery.title')}
          </Typography>
          
          <UploadMedia />
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              {[...galleryItems]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((item) => (
                <Card 
                  key={item.id} 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => handleMediaClick(item)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: '50%',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.type === 'image' ? (
                      <ImageIcon sx={{ color: 'white', fontSize: 20 }} />
                    ) : (
                      <VideocamIcon sx={{ color: 'white', fontSize: 20 }} />
                    )}
                  </Box>
                  <CardMedia
                    component={item.type === 'image' ? 'img' : 'video'}
                    height="200"
                    image={item.type === 'image' ? `/api/media/${item.id}` : undefined}
                    src={item.type === 'video' ? `/api/media/${item.id}` : undefined}
                    alt={item.title}
                    controls={false}
                    sx={{
                      objectFit: 'cover',
                      aspectRatio: '4/3',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  />
                </Card>
              ))}
            </Box>
          )}
        </Paper>
      </Container>

      {/* Modal for enlarged media */}
      <Modal
        open={Boolean(selectedMedia)}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
      >
        <Box sx={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <MuiIconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: -12,
              top: -12,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
              },
              zIndex: 1
            }}
          >
            <CloseIcon />
          </MuiIconButton>
          {selectedMedia && (
            selectedMedia.type === 'image' ? (
              <img
                src={`/api/media/${selectedMedia.url.split('/').pop()}`}
                alt={selectedMedia.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
              />
            ) : (
              <video
                src={`/api/media/${selectedMedia.url.split('/').pop()}`}
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  borderRadius: 8
                }}
              />
            )
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default Gallery; 