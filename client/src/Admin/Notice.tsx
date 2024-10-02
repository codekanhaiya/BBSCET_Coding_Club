import * as React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

const AdminNoticeBoard = () => {
  const [notice, setNotice] = React.useState('');
  const [notices, setNotices] = React.useState<any[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // State to store error message
  const [open, setOpen] = React.useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  // Fetch notices from the server and sort by latest date and time
  const fetchNotices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notices');
      if (!response.ok) {
        throw new Error('Failed to fetch notices.');
      }
      const data = await response.json();

      // Sort notices by date, from latest to oldest
      const sortedData = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setNotices(sortedData); // Update state with sorted data
      setErrorMessage(null); // Clear any previous error messages
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };


  // Handle adding a new notice
  const handleAddNotice = async () => {
    if (notice.trim()) {
      const newNotice = {
        message: notice.trim(),
      };

      const response = await fetch('http://localhost:8080/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotice),
      });

      if (response.ok) {
        const savedNotice = await response.json();
        setNotices([savedNotice, ...notices]); // Add new notice at the beginning
        setNotice('');
        setSnackbarMessage('Notice added successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to add notice.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Please write a notice message before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle delete click to open confirmation dialog
  const handleDeleteClick = (id: string) => {
    setSelectedNoticeId(id);
    setOpen(true);
  };

  // Handle confirmation of delete
  const handleConfirmDelete = async () => {
    if (selectedNoticeId !== null) {
      const response = await fetch(`http://localhost:8080/api/notices/${selectedNoticeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedNotices = notices.filter((notice) => notice._id !== selectedNoticeId);
        setNotices(updatedNotices);
        setSnackbarMessage('Notice deleted successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to delete notice.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      handleClose();
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    setSelectedNoticeId(null);
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    fetchNotices(); // Fetch notices when component mounts
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>A</Avatar>
          <Typography variant="h6">Admin Notice Board</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ m: 4 }}>
        <Typography variant="h5">Publish a New Notice</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Notice Message"
            variant="outlined"
            fullWidth
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
          />
          <Tooltip title="Publish">
            <IconButton color="primary" onClick={handleAddNotice}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Published Notices
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errorMessage ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {errorMessage} {/* Display error message in the table */}
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice, index) => (
                <TableRow key={notice._id}>
                  <TableCell>{notices.length - index}</TableCell>
                  <TableCell>{notice.message}</TableCell>
                  <TableCell>{new Date(notice.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteClick(notice._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon /> {/* Use CloseIcon instead of text */}
          </IconButton>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }} // Optional: Change background color based on severity
      />
    </Container>
  );
};

export default AdminNoticeBoard;
