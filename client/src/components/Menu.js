import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm'; // Assuming you have a login form component

import { useState, useEffect  } from 'react';
import { Snackbar, Alert } from '@mui/material'; // Or '@mui/material' depending on version

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLogin, setOpenLogin] = React.useState(false); // For login popup
  const [openLogout, setOpenLogout] = React.useState(false); // For logout confirmation
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [snackSeverity, setSnackSeverity] = useState('');
  const [snackMessage, setSnackMessage] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Check for the authentication token on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  const handleSnackClose = () => {
    setSnackOpen(false);
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
    handleClose();
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard'); // Redirect to dashboard page
    handleClose();
  };

  const handleLogoutConfirm = () => {
    setOpenLogout(true); // Open confirmation dialog for logout
  };

  const handleCloseLogout = () => {
    setOpenLogout(false);
  };

  const handleConfirmLogout = async () => {
    try {
      const url = 'http://localhost:8080/api/auth/logout';  // Adjust if needed
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`  // Sending token for authentication
        }
      });
  
      const result = await response.json();
      if (response.ok) { // Check if the response was successful
        setSnackSeverity('success');
        setSnackMessage(result.message || 'Logout successful');
        setSnackOpen(true);
  
        // Clear token from localStorage and update the login state
        localStorage.removeItem('authToken'); // Ensure correct token key
        setIsLoggedIn(false); // Update login status
  
        setTimeout(() => {
          navigate('/');  // Redirect to login after logout
        }, 1000);
      } else {
        setSnackSeverity('error');
        setSnackMessage(result.message || 'Logout failed');
        setSnackOpen(true);
      }
    } catch (err) {
      setSnackSeverity('error');
      setSnackMessage('An unexpected error occurred.');
      setSnackOpen(true);
    }
  
    setOpenLogout(false);  // Close the logout confirmation dialog
  };
  


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Link to="/">
              <HomeIcon style={{ color: 'white' }} />
            </Link>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BBS Coding Club
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Menu">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <MenuIcon sx={{ fontSize: 32, color: 'white' }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleDashboard}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              My Dashboard
            </MenuItem>
            {isLoggedIn && ( // Show logout menu only when logged in
              <>
                <Divider />
                <MenuItem onClick={handleLogoutConfirm}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </>
            )}
            <Divider />
            <MenuItem onClick={() => navigate('/signup')}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Register
            </MenuItem>
            <MenuItem onClick={handleOpenLogin}>
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          </Menu>

          {/* Login Dialog */}
          <Dialog open={openLogin} onClose={handleCloseLogin}>
            <DialogTitle>Login:</DialogTitle>
            <DialogContent>
              <LoginForm />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLogin} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Logout Confirmation Dialog */}
          <Dialog
            open={openLogout}
            onClose={handleCloseLogout}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to logout?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLogout} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmLogout} color="primary" autoFocus>
                Logout
              </Button>
            </DialogActions>
          </Dialog>
          {/* Snackbar for success or error messages */}
          <Snackbar
            open={snackOpen}
            autoHideDuration={2500}
            onClose={handleSnackClose}
          >
            <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
              {snackMessage}
            </Alert>
          </Snackbar>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
