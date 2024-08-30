import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
//import api from '../Admin/api/axios';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
 /*   e.preventDefault();
    try {
     const response = await api.post('/users/forgot-password', { email });
      setMessage(response.data);
      setError('');
      setOpenSnackbar(true);
    } catch (err) {
      setError('Error sending password reset email');
      setMessage('');
      setOpenSnackbar(true);
    } */
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 15,
          borderRadius: 8,
          backgroundColor: '#37474f'

        }}
      >
        <Typography variant="h5">Forgot Password</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
            {error || message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ForgotPass;
