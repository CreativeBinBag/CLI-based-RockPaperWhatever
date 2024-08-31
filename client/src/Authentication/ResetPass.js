import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import api from '../api/axios';
const ResetPass = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/users/reset-password/${token}`, { password });
      setMessage(response.data);
      setError('');
      setOpenSnackbar(true);
      
    } catch (err) {
      setError('Error resetting password');
      setMessage('');
      setOpenSnackbar(true);
    } 
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
      <Typography variant="h5" mt={2}>New Password</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{mt:1}}>
        <TextField
              margin="normal"
              fullWidth
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required       
        />
        <Button
         type="submit"
         fullWidth
         variant="contained"
         color="primary"
         sx={{ mt: 3, mb: 2 }}
       >
         Reset Password
        </Button>
      </Box>
      <Snackbar
       open = {openSnackbar}
       autoHideDuration={6000}
       onClose={()=> setOpenSnackbar(false)}      
      >
         <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
          {error || message}
         </Alert>
      </Snackbar>
    </Box>
   </Container>

  );
};

export default ResetPass;