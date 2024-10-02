import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login'; // Import the login icon
import Visibility from '@mui/icons-material/Visibility'; // Import the visibility icon
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Import the visibility off icon

export default function PasswordResetForm() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState('info');
    const [snackOpen, setSnackOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setIsEmailInvalid(false); // Reset email invalid flag when typing
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
        setPasswordError(''); // Reset password error when typing
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setIsEmailInvalid(true);
            return;
        }

        // Password validation
        const password = newPassword.trim();
        const errors = {};
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            errors.password = 'Password must contain at least one number and one special character';
        }

        if (errors.password) {
            setPasswordError(errors.password);
            return;
        }

        try {
            const url = 'http://localhost:8080/api/auth/reset-password'; // Your API endpoint
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });

            const result = await response.json();
            const { success, message } = result;

            if (success) {
                setSnackSeverity('success');
                setSnackMessage(message); // Use the server's success message
                setSnackOpen(true);

                // Navigate to login page after 3 seconds
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page
                }, 3000);
            } else {
                setSnackSeverity('error');
                setSnackMessage(message || 'Password reset failed.');
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
                alignItems: 'flex-start',
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
                name="newPassword"
                label="New Password"
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                autoComplete="new-password"
                error={!!passwordError} // Show error if password error exists
                helperText={passwordError} // Display password error message
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword((prev) => !prev)} // Toggle the showPassword state
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />} {/* Show appropriate icon */}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Reset Password
            </Button>
            <Typography variant="body2" sx={{ width: '100%', textAlign: 'left' }}>
                Remember your password?{' '}
                <Link href="/login" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LoginIcon sx={{ fontSize: 14, marginRight: 0.5 }} /> {/* Add the login icon */}
                    Login here
                </Link>
            </Typography>

            {/* Snackbar for displaying messages */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={2500}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackClose}
                    severity={snackSeverity}
                    sx={{ width: '100%', maxWidth: '600px' }}
                >
                    {snackMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
