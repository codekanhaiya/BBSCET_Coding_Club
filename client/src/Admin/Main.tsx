import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

// Import the registration and login forms
import RegisterForm from './Register.tsx';
import LoginForm from './Login.tsx';
import AdminDash from './AdminDash.tsx';
import Notice from './Notice.tsx';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Check if user is logged in by checking for the token
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
      <Box sx={{ bgcolor: 'background.paper', width: '90%' }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Register" {...a11yProps(0)} />
            <Tab label="Login" {...a11yProps(1)} />
            <Tab label="Dashboard" {...a11yProps(2)} />
            <Tab label="Notice" {...a11yProps(3)} />
          </Tabs>
        </AppBar>

        {/* Register Tab */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          {isLoggedIn ? (
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              You can't access the registration form.
            </Typography>
          ) : (
            <RegisterForm />
          )}
        </TabPanel>

        {/* Login Tab */}
        <TabPanel value={value} index={1} dir={theme.direction}>
          {isLoggedIn ? (
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              You can't access the login form.
            </Typography>
          ) : (
            <LoginForm />
          )}
        </TabPanel>

        {/* Dashboard Tab */}
        <TabPanel value={value} index={2} dir={theme.direction}>
          {isLoggedIn ? (
            <AdminDash />
          ) : (
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              You can't access the dashboard panel without login.
            </Typography>
          )}
        </TabPanel>

        {/* Notice Tab */}
        <TabPanel value={value} index={3} dir={theme.direction}>
          {isLoggedIn ? (
            <Notice />
          ) : (
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              You can't access the notice panel without login.
            </Typography>
          )}
        </TabPanel>

      </Box>
    </Container>
  );
}
