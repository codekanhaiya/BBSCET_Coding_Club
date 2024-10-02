import React from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme, useMediaQuery } from '@mui/material';

// Import your images
import firstImage from '../img/first.avif';
import secondImage from '../img/second.avif';
import thirdImage from '../img/third.avif';

// Sample images for carousel
const images = [
  { id: 1, src: firstImage, alt: 'Slide 1', caption: 'Welcome to BBS Coding Club' },
  { id: 2, src: secondImage, alt: 'Slide 2', caption: 'Explore Coding with Us' },
  { id: 3, src: thirdImage, alt: 'Slide 3', caption: 'Join Our Hackathons!' },
];

const Carousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Media query for responsiveness

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Light background and padding */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5', // Light grey background
          borderRadius: '10px',
          padding: 3,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Slider {...settings}>
          {images.map((image) => (
            <Box key={image.id} sx={{ textAlign: 'center' }}>
              {/* Image with responsive height */}
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: isMobile ? '250px' : '400px', // Adjust height for mobile
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              {/* Caption */}
              <Typography variant="h6" component="div" sx={{ paddingTop: 2 }}>
                {image.caption}
              </Typography>
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
};

export default Carousel;
