import * as React from 'react';
import {
  AppBar, Avatar, Box, Button, Container, CssBaseline, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography,
  TextField, InputAdornment, Tooltip, TablePagination, CircularProgress, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { jwtDecode } from 'jwt-decode';

// Inside the AdminDashboard component, after the Toolbar section
const token = localStorage.getItem('token');
let tokenData: any = null;

if (token) {
  try {
    tokenData = jwtDecode(token); // Decode the token
  } catch (error) {
    console.error("Invalid token:", error);
  }
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminDashboard = () => {
  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [selectedStudentEmail, setSelectedStudentEmail] = React.useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [students, setStudents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailContent, setEmailContent] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students!');
      }
      const data = await response.json();
      setStudents(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const handleSend = (email: string) => {
    setSelectedStudentEmail(email);
    setOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Email subject and content cannot be empty.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'kanhaiyaguptaksg@gmail.com',
          to: selectedStudentEmail,
          subject: emailSubject,
          content: emailContent,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Email address not found.');
        }
        throw new Error('Failed to send email!');
      }

      setSnackbarSeverity('success');
      setSnackbarMessage('Email sent successfully.');
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.message);
    } finally {
      setSnackbarOpen(true);
      setOpen(false);
      setEmailContent('');
      setEmailSubject('');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedStudentId(id);
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudentId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/students/${selectedStudentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student!');
      }

      setSnackbarSeverity('success');
      setSnackbarMessage('Student deleted successfully.');
      setSnackbarOpen(true);
      fetchStudents(); // Refresh the list after deletion
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setOpenConfirm(false);
      setSelectedStudentId(null);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredStudents = students.filter(student =>
    Object.values(student).some(value =>
      String(value).toLowerCase().startsWith(searchQuery.toLowerCase())  // Search starts with query
    )
  );

  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('token'); // Remove the token from localStorage
    setSnackbarSeverity('success');
    setSnackbarMessage('Logged out successfully.'); // Set the message for logout
    setSnackbarOpen(true); // Open the snackbar

    setTimeout(() => {
      window.location.reload(); // Reload the page after 3 seconds
    }, 3000);
  };



  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>A</Avatar>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 2, mb: 2 }}>
        {tokenData ? (
          <Box component="pre" sx={{ backgroundColor: '#f5f5f5', p: 2, ml: 5, borderRadius: '4px', overflowX: 'auto' }}>
            {/* Show only the admin name and email */}
            {tokenData.name && (
              <Typography>
                <strong>Name:</strong> {tokenData.name}
              </Typography>
            )}
            {tokenData.email && (
              <Typography>
                <strong>Email:</strong> {tokenData.email}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography>Admin not found or token is invalid.</Typography>
        )}
      </Box>


      <Box sx={{ mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Student Data
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((student, index) => (
                <TableRow key={student._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{`${student.course} ${student.subField}`}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleSend(student.email)}>
                      <SendIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(student._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the subject and content of the email to be sent to {selectedStudentEmail}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Subject"
            type="text"
            fullWidth
            variant="outlined"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email Content"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleSendEmail} color="primary">Send</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
