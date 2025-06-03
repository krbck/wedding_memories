import { useState, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  LinearProgress,
  Card,
  CardMedia,
  AppBar,
  Toolbar,
  Link,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { GalleryContext } from '../App';

interface UploadedFile {
  file: File;
  progress: number;
  preview: string;
  error?: string;
}

function Home() {
  const { t, i18n } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { addGalleryItem } = useContext(GalleryContext);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      preview: URL.createObjectURL(file)
    }));

    setUploadedFiles(prev => [...newFiles, ...prev]);

    // Upload each file
    newFiles.forEach((file, index) => {
      const isImage = file.file.type.startsWith('image/');
      const isVideo = file.file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        setUploadedFiles(prev => 
          prev.map((f, i) => 
            i === index ? { ...f, error: t('gallery.invalidFileType') } : f
          )
        );
        return;
      }


      const formData = new FormData();
      formData.append('file', file.file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadedFiles(prev => 
            prev.map((f, i) => 
              i === index ? { ...f, progress } : f
            )
          );
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            addGalleryItem({
              id: data.id,
              type: isImage ? 'image' : 'video',
              url: `/api/media/${data.id}`,
              title: file.file.name,
              timestamp: new Date().toISOString()
            });
          } catch (err) {
            setUploadedFiles(prev => 
              prev.map((f, i) => 
                i === index ? { ...f, error: t('gallery.uploadError') } : f
              )
            );
          }
        } else {
          setUploadedFiles(prev => 
            prev.map((f, i) => 
              i === index ? { ...f, error: `Upload failed: ${xhr.statusText}` } : f
            )
          );
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setUploadedFiles(prev => 
          prev.map((f, i) => 
            i === index ? { ...f, error: t('gallery.uploadError') } : f
          )
        );
        setUploading(false);
      });

      xhr.open('POST', '/api/media');
      xhr.send(formData);
    });
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
          <Link component={RouterLink} to="/gallery" color="primary" underline="none" sx={{ 
            '&:hover': { 
              color: 'primary.dark',
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease'
            }
          }}>
            {t('nav.gallery')}
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 3, md: 4 }
      }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            background: 'linear-gradient(45deg, #4a4a4a 30%, #757575 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('home.title')}
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ 
            mb: { xs: 3, sm: 4, md: 6 },
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            px: { xs: 1, sm: 2 }
          }}>
            {t('home.subtitle')}
          </Typography>

          <Box sx={{ mb: 6 }}>
            <input
              accept="image/*,video/*"
              style={{ display: 'none' }}
              id="upload-button"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
            <label htmlFor="upload-button">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                size="large"
                disabled={uploading}
                sx={{
                  background: 'linear-gradient(45deg, #4a4a4a 30%, #757575 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2d2d2d 30%, #4a4a4a 90%)',
                  }
                }}
              >
                {uploading ? t('home.uploading') : t('home.uploadButton')}
              </Button>
            </label>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {uploadedFiles.map((file, index) => (
              <Card key={index} sx={{ height: '100%' }}>
                {file.file.type.startsWith('image/') ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={file.preview}
                    alt={`Uploaded ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <CardMedia
                    component="video"
                    height="200"
                    src={file.preview}
                    controls
                  />
                )}
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" noWrap>
                    {file.file.name}
                  </Typography>
                  {file.error ? (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {file.error}
                    </Alert>
                  ) : (
                    <LinearProgress 
                      variant="determinate" 
                      value={file.progress} 
                      sx={{ 
                        mt: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(45deg, #4a4a4a 30%, #757575 90%)'
                        }
                      }}
                    />
                  )}
                </Box>
              </Card>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home; 