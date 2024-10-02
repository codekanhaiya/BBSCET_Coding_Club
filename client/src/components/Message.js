import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, useMediaQuery, Divider, Chip, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FlagIcon from '@mui/icons-material/Flag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CampaignIcon from '@mui/icons-material/Campaign';

const MessageSection = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // State to store notices and loading state
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notices from the server
  const fetchNotices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notices');
      const data = await response.json();
      // Assuming data is an array of notices, sort by date descending
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notices on component mount
  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <Box sx={{ padding: isSmallScreen ? 2 : 4, marginBottom: 4 }}>
      <Grid container spacing={4}>
        {/* Left Section: Coding Club's Mission and Vision */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#f0f4c3',
              padding: 3,
              borderRadius: 2,
              height: '100%',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Mission Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <FlagIcon sx={{ fontSize: 40, color: '#ff7043' }} />
              <Typography variant="h5" sx={{ marginLeft: 2 }}>
                Our Mission
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ marginBottom: 4 }}>
              Our mission is to foster a love for coding and technology in students, promoting
              collaborative learning and hands-on projects. We aim to build a strong community of
              coders and innovators who are ready to face the challenges of the tech world.
            </Typography>

            <Divider />

            {/* Vision Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 4, marginBottom: 2 }}>
              <VisibilityIcon sx={{ fontSize: 40, color: '#42a5f5' }} />
              <Typography variant="h5" sx={{ marginLeft: 2 }}>
                Our Vision
              </Typography>
            </Box>
            <Typography variant="body1">
              Our vision is to empower students with the knowledge and skills needed to excel in the
              tech industry, through mentorship, hackathons, and industry-level coding experience.
            </Typography>
          </Box>
        </Grid>

        {/* Right Section: Scrolling Notice Board */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#e3f2fd',
              padding: 3,
              borderRadius: 2,
              height: '100%',
              overflow: 'hidden',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Notice Board Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <CampaignIcon sx={{ fontSize: 40, color: '#ef5350' }} />
              <Typography variant="h5" sx={{ marginLeft: 2 }}>
                Notice Board
              </Typography>
            </Box>

            {/* Scrolling Messages */}
            <Box sx={{ height: 200, position: 'relative', overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  animation: 'scrollUp 20s linear infinite',
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : notices.length > 0 ? (
                  <>
                    {/* Display latest notice with "New" tag and date */}
                    <Typography
                      variant="body1"
                      sx={{ padding: 1, textAlign: 'left', color: '#424242', fontWeight: 'bold' }}
                    >
                      <Chip label="New" color="primary" size="small" sx={{ marginRight: 1 }} />
                      {notices[0].message}
                      <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                        {new Date(notices[0].date).toLocaleDateString()}
                      </Typography>
                    </Typography>
                    {/* Map through all older notices */}
                    {notices.slice(1).map((notice, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        sx={{ padding: 1, textAlign: 'left', color: '#424242' }}
                      >
                        {notice.message}
                        <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                          {new Date(notice.date).toLocaleDateString()}
                        </Typography>
                      </Typography>
                    ))}
                  </>
                ) : (
                  <Typography variant="body1" sx={{ padding: 1, textAlign: 'left', color: '#424242' }}>
                    No any message available!
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Scroll Animation */}
      <style>
        {`
          @keyframes scrollUp {
            0% {
              transform: translateY(100%);
            }
            100% {
              transform: translateY(-100%);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MessageSection;
