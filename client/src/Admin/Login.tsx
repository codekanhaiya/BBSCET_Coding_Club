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
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

// Define the type for form errors
type FormErrors = {
  email: string;
  password: string;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Set primary color to blue
    },
  },
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    email: '',
    password: '',
  });
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error' | 'warning'>('success');

  const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {
      email: '',
      password: '',
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const email = data.get('email') as string;
    if (!email) {
      errors.email = 'Email Address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format';
    }

    const password = data.get('password') as string;
    if (!password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errors = validateForm(data);

    if (Object.keys(errors).some(key => errors[key as keyof FormErrors] !== '')) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({ email: '', password: '' });

    const adminData = {
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await fetch('http://localhost:8080/adm/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Login successful:', result);
        localStorage.setItem('token', result.token);
        setSnackbarSeverity('success');
        setSnackbarMessage('Login successful!');
        setSnackbarOpen(true);
        // Reload the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3000 milliseconds = 3 seconds
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(result.message);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('An unexpected error occurred. Please try again later.');
      setSnackbarOpen(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
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
            Login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
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
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          </Box>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
