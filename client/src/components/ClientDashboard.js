import React, { useEffect, useState } from 'react';
import {
  Typography,
  Avatar,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/members', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data); // Update state with fetched user data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  // Add a check to ensure user is not null before accessing properties
  if (!user) {
    return <Typography variant="h6" margin={'20px'}>Sorrry! No members data found.</Typography>;
  }

  return (
    <Container>
      <Box my={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Avatar sx={{ width: 100, height: 100, mb: 2 }} />
                <Typography variant="h5">{`${user.firstName} ${user.lastName}`}</Typography>
                <Typography color="textSecondary">{user.email}</Typography>
                <Typography variant="body1">Roll No: {user.rollNumber}</Typography>
                <Typography variant="body1">Branch: {`${user.course} ${user.subField}`}</Typography>
                <Typography variant="body1">Study Year: {user.year}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5">Welcome to BBS Coding Club!</Typography>
                <Typography variant="body2" gutterBottom>
                  Here are your study materials:
                </Typography>
                <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                  View Study Materials
                </Button>
                {/* You can add more sections for study materials here */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
