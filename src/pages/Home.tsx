import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  LinearProgress,
  Card,
  CardMedia,
  Grid,
  AppBar,
  Toolbar,
  Link,
  Paper,
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

interface UploadedFile {
  file: File;
  progress: number;
  preview: string;
}

function Home() {
  const { t, i18n } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
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

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadedFiles(prev => 
          prev.map((f, i) => 
            i === index ? { ...f, progress } : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          setUploading(false);
        }
      }, 200);
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
        py: 4
      }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            mb: 4,
            background: 'linear-gradient(45deg, #4a4a4a 30%, #757575 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('home.title')}
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 6 }}>
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
                sx={{
                  background: 'linear-gradient(45deg, #4a4a4a 30%, #757575 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2d2d2d 30%, #4a4a4a 90%)',
                  }
                }}
              >
                {t('home.uploadButton')}
              </Button>
            </label>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {uploadedFiles.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
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
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home; 