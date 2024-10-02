import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const navigate = useNavigate();

  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('info');
  const [snackOpen, setSnackOpen] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsEmailInvalid(false); // Reset email invalid flag when typing
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsPasswordWrong(false); // Reset wrong password flag when typing
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsEmailInvalid(true);
      return;
    }

    try {
      const url = 'http://localhost:8080/api/auth/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      const { success, message, token, error } = result;

      if (success) {
        // Store the token in localStorage or cookies
        localStorage.setItem('authToken', token);

        setSnackSeverity('success');
        setSnackMessage(message); // Use the server's success message
        setSnackOpen(true);

        // Reload the webpage and navigate to dashboard after 1 second
        setTimeout(() => {
          window.location.reload(); // Reload the page
          navigate('/dashboard'); // Redirect to dashboard
        }, 1000);
      } else if (error) {
        setSnackSeverity('error');
        setSnackMessage(error.details[0]?.message || message);
        setSnackOpen(true);
        setIsPasswordWrong(true); // Mark password error if applicable
      } else {
        setSnackSeverity('error');
        setSnackMessage(message || 'Login failed.');
        setSnackOpen(true);
      }
    } catch (err) {
      setSnackSeverity('error');
      setSnackMessage('An unexpected error occurred.');
      setSnackOpen(true);
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align items to the left
        width: { xs: '90%', sm: '400px' },
        maxWidth: '100%',
        mx: 'auto',
        padding: { xs: 2, sm: 3 },
      }}
    >
      <TextField
        margin="normal"
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={handleEmailChange}
        error={isEmailInvalid}
        helperText={isEmailInvalid ? "Invalid email address." : ""}
      />
      <TextField
        margin="normal"
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        value={password}
        onChange={handlePasswordChange}
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {isPasswordWrong && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          Incorrect password. Please try again.
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
      <Typography variant="body2" sx={{ width: '100%', textAlign: 'left' }}>
        Don't have an account?{' '}
        <Link href="/signup" sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonAddIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Register here
        </Link>
      </Typography>

      {/* Show "Forgot Password?" link always */}
      <Typography variant="body2" sx={{ width: '100%', textAlign: 'right' }}>
        <Link href="/reset-password" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <LockOpenIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Forgot Password?
        </Link>
      </Typography>

      {/* Snackbar for displaying messages */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Center horizontally at the top
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackSeverity}
          sx={{ width: '100%', maxWidth: '600px' }} // Adjust maxWidth for larger size
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
