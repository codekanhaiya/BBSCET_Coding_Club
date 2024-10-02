import * as React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

export default function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    adminId: '',
  });
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const validateForm = (data) => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      adminId: '',
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const adminIdRegex = /^ADB[0-9]{5}$/;

    if (!data.get('firstName')) {
      errors.firstName = 'First Name is required';
    }
    if (!data.get('lastName')) {
      errors.lastName = 'Last Name is required';
    }
    const email = data.get('email');
    if (!email) {
      errors.email = 'Email Address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format';
    }
    const password = data.get('password')?.trim();
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      errors.password = 'Password must contain at least one number and one special character';
    }
    const adminId = data.get('adminId');
    if (!adminId) {
      errors.adminId = 'Admin ID is required';
    } else if (!adminIdRegex.test(adminId)) {
      errors.adminId = 'Admin ID must start with "ADB" followed by 5 digits';
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errors = validateForm(data);

    if (Object.keys(errors).some((key) => errors[key] !== '')) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({ firstName: '', lastName: '', email: '', password: '', adminId: '' });

    const adminData = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
      adminId: data.get('adminId'),
    };

    try {
      const response = await fetch('http://localhost:8080/adm/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      const result = await response.json();

      // Handle response messages
      if (response.ok) {
        setSnackbarMessage(result.message);
        // Reload the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3000 milliseconds = 3 seconds
      } else {
        setSnackbarMessage(result.message); // Show specific error message from the server
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error registering admin:', error);
      setSnackbarMessage('Error registering admin! Please try again later.');
      setSnackbarOpen(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ bgcolor: '#F0FFE0', padding: 3 }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="primary">
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="firstName"
                  name="firstName"
                  required
                  fullWidth
                  label="First Name"
                  autoFocus
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    inputProps: { style: { color: 'blue' } },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="lastName"
                  name="lastName"
                  required
                  fullWidth
                  label="Last Name"
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    inputProps: { style: { color: 'blue' } },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  name="email"
                  required
                  fullWidth
                  label="Email Address"
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    inputProps: { style: { color: 'blue' } },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  name="password"
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    inputProps: { style: { color: 'blue' } },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="adminId"
                  name="adminId"
                  required
                  fullWidth
                  label="Admin ID"
                  error={!!formErrors.adminId}
                  helperText={formErrors.adminId}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    inputProps: { style: { color: 'blue' } },
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
