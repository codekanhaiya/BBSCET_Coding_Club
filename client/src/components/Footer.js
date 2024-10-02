import React from 'react';
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Link } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, LinkedIn, School, Person } from '@mui/icons-material'; // Social media icons
import SendIcon from '@mui/icons-material/Send'; // Icon for subscribe button

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1a237e', color: '#fff', padding: '40px 0', marginTop: '50px' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Section - Club Info and Copyright */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              BBS Coding Club
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              Join our community of developers, participate in hackathons, learn from workshops, and grow your skills.
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              &copy; {new Date().getFullYear()} BBS Coding Club. All rights reserved.
            </Typography>
          </Grid>

          {/* Center Section - Subscribe to Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Subscribe to our Newsletter
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              Stay updated with the latest events, hackathons, and news from the club.
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="filled"
                label="Your Email"
                type="email"
                sx={{ backgroundColor: '#fff', borderRadius: '4px', marginRight: 1, flexGrow: 1 }}
                size="small"
              />
              <Button variant="contained" color="primary" endIcon={<SendIcon />} sx={{ height: '40px' }}>
                Subscribe
              </Button>
            </Box>
          </Grid>

          {/* Right Section - Social Media Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Follow Us
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              Connect with us on social media:
            </Typography>
            <Box>
              <IconButton
                component="a"
                href="https://bbs.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="College"
                sx={{ color: '#fff' }}
              >
                <School />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.facebook.com/bbsprayagraj/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{ color: '#fff' }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com/BbsCollege"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                sx={{ color: '#fff' }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/bbscollege/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                sx={{ color: '#fff' }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/company/bbscet-prayagraj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                sx={{ color: '#fff' }}
              >
                <LinkedIn /> {/* LinkedIn icon */}
              </IconButton>
              <IconButton
                component="a"
                href="https://www.youtube.com/channel/UCPEWCEhKGjZCR4q2pQhwIeA?app=desktop"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                sx={{ color: '#fff' }}
              >
                <YouTube />
              </IconButton>
            </Box>

            {/* Developed by Section */}
            <Typography variant="body2" sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton
                component="a"
                href="http://officialkanha.epizy.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Developer Link"
                sx={{ color: '#fff', marginRight: 1 }}
              >
                <Person /> {/* Using Person icon for the developer */}
              </IconButton>
              Developed by:
              <Link
                href="http://officialkanha.epizy.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', marginLeft: 0.5 }}
              >
                Kanhaiya Gupta
              </Link>
            </Typography>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
