import { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { blue } from '@mui/material/colors';


const Login = () => {

  const { login, auth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

 useEffect(() => {
    if (success) {
      if (auth?.role === 'admin') {
        navigate('/'); 
      } else {
        navigate('/login'); 
      }
    }
  }, [success, auth, navigate]); 


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(user, pwd);
      setSuccess(true);
      setUser('');
      setPwd('');
    
    } catch (error) {
      setErrMsg('Login Failed');
      errRef.current.focus();
    }
  };

  return (
    <Container component ="main" maxWidth="xs">

      <Box
        sx={{
          display: "flex",
          flexDirection: 'column',
          alignItems: 'center',
          mt: 10,
          height: '50vh',
          width: '30vw',
          backgroundColor: blue,
          p: '5px 10px 15px',
          borderRadius: 5
        }}
       >
      {success ? (
          <Box>
          <Typography variant="h5">You are logged in!</Typography>
          <br />
          <Link to="/logout">Logout</Link> {/*link for now, change later to cli*/}
        </Box>
      ) : (
        <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
          {errMsg && (
            <Alert ref={errRef} severity="error" sx={{mb:2}}>
              {errMsg}
            </Alert>
          )}
         <Typography variant="h5"sx={{ fontWeight: 'bold', fontSize: 20, mt: 2}}>Login</Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{mt:1, width: '100%'}}
          >
            <TextField
              label="Username"
              id="username"
              inputRef={userRef}
              variant= "outlined"
              fullWidth
              autoComplete="off"
              margin="normal"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />
            
            <TextField
                label="Password"
                id="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />

              <Button
                type="submit"
                variant="contained"
               
              >
                Sign In
              </Button>

              <Box sx={{ mt: 2 }}>
                <Link to="/forgot-password">Forgot Password?</Link>
              </Box>
              <Box sx={{ mt: 2 }}>
                Need an account? <Link to="/register">Sign Up</Link>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Container>

   
  );
};

export default Login;
