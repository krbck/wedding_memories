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
import VideocamIcon from '@mui/icons-material/Videocam';
import { GalleryContext } from '../App';
import { UploadMedia } from '../components/UploadMedia';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  timestamp: string;
}

function Gallery() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { galleryItems, isLoading, error } = useContext(GalleryContext);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

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

  const handleMediaClick = (item: GalleryItem) => {
    if (item.type === 'video') {
      const videoElement = document.createElement('video');
      videoElement.src = `/api/media/${item.url.split('/').pop()}`;
      videoElement.controls = true;
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.position = 'fixed';
      videoElement.style.top = '0';
      videoElement.style.left = '0';
      videoElement.style.zIndex = '9999';
      videoElement.style.backgroundColor = 'black';
      videoElement.style.objectFit = 'contain';
      
      const handleClose = () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if ((document as any).webkitFullscreenElement) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozFullScreenElement) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msFullscreenElement) {
          (document as any).msExitFullscreen();
        }
        document.body.removeChild(videoElement);
        document.body.style.overflow = 'auto';
      };
      
      // Handle fullscreen change
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement && 
            !(document as any).webkitFullscreenElement && 
            !(document as any).mozFullScreenElement && 
            !(document as any).msFullscreenElement) {
          handleClose();
        }
      };
      
      // Handle back button
      const handleBackButton = (e: PopStateEvent) => {
        e.preventDefault();
        handleClose();
        window.history.pushState(null, '', window.location.href);
      };
      
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);
      window.addEventListener('popstate', handleBackButton);
      
      videoElement.onended = handleClose;
      
      document.body.style.overflow = 'hidden';
      document.body.appendChild(videoElement);
      
      // Push a new state to enable back button
      window.history.pushState(null, '', window.location.href);
      
      // Request fullscreen when video starts playing
      videoElement.onplay = () => {
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if ((videoElement as any).webkitRequestFullscreen) {
          (videoElement as any).webkitRequestFullscreen();
        } else if ((videoElement as any).mozRequestFullScreen) {
          (videoElement as any).mozRequestFullScreen();
        } else if ((videoElement as any).msRequestFullscreen) {
          (videoElement as any).msRequestFullscreen();
        }
      };

      // Clean up event listeners when video is closed
      const cleanup = () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        window.removeEventListener('popstate', handleBackButton);
      };

      videoElement.addEventListener('ended', cleanup);
      videoElement.addEventListener('pause', () => {
        if (!document.fullscreenElement) {
          cleanup();
        }
      });
    } else {
      setSelectedMedia(item);
    }
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
                  <CardMedia
                    component={item.type === 'video' ? 'video' : 'img'}
                    height="200"
                    image={item.type === 'video' ? undefined : `/api/media/${item.url.split('/').pop()}`}
                    src={item.type === 'video' ? `/api/media/${item.url.split('/').pop()}` : undefined}
                    alt={item.title}
                    sx={{
                      objectFit: 'cover',
                      aspectRatio: '4/3',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  />
                  {item.type === 'video' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '50%',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <VideocamIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          )}
        </Paper>
      </Container>

      {/* Modal for enlarged media */}
      <Modal
        open={Boolean(selectedMedia && selectedMedia.type === 'image')}
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
          {selectedMedia && selectedMedia.type === 'image' && (
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
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default Gallery; 