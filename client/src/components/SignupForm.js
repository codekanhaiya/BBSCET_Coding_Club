import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  IconButton,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    course: '',
    subField: '',
    year: '',
    rollNumber: '',
    gender: '',
    password: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('info');
  const [snackOpen, setSnackOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For roll number, ensure only numbers are entered
    if (name === 'rollNumber' && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Trim whitespace and test the password
    return passwordRegex.test(password.trim());
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required.';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email.';
    }
    if (!formData.course) newErrors.course = 'Course is required.';
    if (formData.course === 'B.Tech' && !formData.subField) newErrors.subField = 'Branch is required.';
    if (!formData.year) newErrors.year = 'Current Study Year is required.';
    if (!formData.rollNumber || formData.rollNumber.length !== 10) newErrors.rollNumber = 'Roll Number must be 10 digits.';
    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if there are errors

    try {
      const url = "http://localhost:8080/api/auth/register";
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });


      const result = await response.json();
      console.log(result);
      const { success, message, error } = result;

      if (success) {
        setSnackSeverity('success');
        setSnackMessage(message);
        setSnackOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || message;
        setSnackSeverity('error');
        setSnackMessage(details);
        setSnackOpen(true);
      } else {
        setSnackSeverity('error');
        setSnackMessage(message);
        setSnackOpen(true);
      }
    } catch (error) {
      setSnackSeverity('error');
      setSnackMessage('An unexpected error occurred.');
      setSnackOpen(true);
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        Registration Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              error={Boolean(errors.email)}
              helperText={errors.email}
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.course)}>
              <InputLabel>Course</InputLabel>
              <Select
                name="course"
                value={formData.course}
                onChange={handleChange}
              >
                <MenuItem value="B.Tech">B.Tech</MenuItem>
                <MenuItem value="BCA">BCA</MenuItem>
                <MenuItem value="BBA">BBA</MenuItem>
              </Select>
              {errors.course && <Typography fontSize={'12px'} paddingLeft={'12px'} color="error">{errors.course}</Typography>}
            </FormControl>
          </Grid>
          {formData.course === 'B.Tech' && (
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(errors.subField)}>
                <InputLabel>Branch</InputLabel>
                <Select
                  name="subField"
                  value={formData.subField}
                  onChange={handleChange}
                >
                  <MenuItem value="CSE">CSE</MenuItem>
                  <MenuItem value="ME">ME</MenuItem>
                  <MenuItem value="EEE">EEE</MenuItem>
                  <MenuItem value="CE">CE</MenuItem>
                </Select>
                {errors.subField && <Typography fontSize={'12px'} paddingLeft={'12px'} color="error">{errors.subField}</Typography>}
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.year)}>
              <InputLabel>Current Study Year</InputLabel>
              <Select
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <MenuItem value="1st Year">1st Year</MenuItem>
                <MenuItem value="2nd Year">2nd Year</MenuItem>
                <MenuItem value="3rd Year">3rd Year</MenuItem>
              </Select>
              {errors.year && <Typography fontSize={'12px'} paddingLeft={'12px'} color="error">{errors.year}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              inputProps={{ maxLength: 10 }}
              error={Boolean(errors.rollNumber)}
              helperText={errors.rollNumber}
              value={formData.rollNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <RadioGroup row name="gender" onChange={handleChange} value={formData.gender}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
            {errors.gender && <Typography fontSize={'12px'} paddingLeft={'12px'} color="error">{errors.gender}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={formData.showPassword ? 'text' : 'password'}
              error={Boolean(errors.password)}
              helperText={errors.password}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                    edge="end"
                  >
                    {formData.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

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
          sx={{ width: '100%', maxWidth: '600px'}} // Adjust maxWidth for larger size
        >
          {snackMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default RegistrationForm;
