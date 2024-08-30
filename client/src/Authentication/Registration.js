import { useRef, useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { Stack, Box, Typography, TextField, Button, IconButton, Alert, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

//import { AuthContext } from "../context/AuthProvider";
//import api from "../Admin/api/axios";

// Regex for validation
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
 // const { login } = useContext(AuthContext);

  // State for username
  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  // State for passwords
  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  // State for password matching
  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // State for email
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  // State for errors
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validate username
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  // Validate password
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // Validate email
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  // Clear error message when user, pwd, matchPwd, or email changes
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd, email]);

  const handleSubmit = async (e) => {
 /*   e.preventDefault();

    if (!validName || !validPwd || !validMatch || !validEmail) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await api.post("/users/register", {
        userName: user,
        email,
        password: pwd,
      });

      if (response.status === 201) {
  //      await login(user, pwd);
        setSuccess(true);
        setUser('');
        setPwd('');
        setMatchPwd('');
      } else {
        setErrMsg('Unexpected response status');
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    } */
  };

  return (
    <Box component="section" sx={{ maxWidth: 400, mx: "auto", mt: 10, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#757575' }}>
      {success ? (
        <Typography variant="h5" align="center">Success! <br /><Link to="/login">Sign In</Link></Typography>
      ) : (
        <>
          <div ref={errRef}>
            {errMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errMsg}
              </Alert>
            )}
          </div>

          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Username"
                type="text"
                id="username"
                inputRef={userRef}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                error={userFocus && user && !validName}
                helperText={
                  userFocus && user && !validName
                    ? "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed."
                    : ""
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" disabled>
                          {validName ? <FontAwesomeIcon icon={faCheck} color="green"/> : <FontAwesomeIcon icon={faTimes} color="red"/>}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                aria-invalid={validName ? "false" : "true"}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={emailFocus && email && !validEmail}
                helperText={
                  emailFocus && email && !validEmail
                    ? "Must be a valid email address."
                    : ""
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" disabled>
                          {validEmail ? <FontAwesomeIcon icon={faCheck} color="green" /> : <FontAwesomeIcon icon={faTimes} color="red" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                aria-invalid={validEmail ? "false" : "true"}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                id="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                error={pwdFocus && !validPwd}
                helperText={
                  pwdFocus && !validPwd
                    ? "8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character."
                    : ""
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" disabled>
                          {validPwd ? <FontAwesomeIcon icon={faCheck} color="green" /> : <FontAwesomeIcon icon={faTimes} color="red" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                aria-invalid={validPwd ? "false" : "true"}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Confirm Password"
                type="password"
                id="confirm_pwd"
                value={matchPwd}
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                error={matchFocus && !validMatch}
                helperText={
                  matchFocus && !validMatch
                    ? "Must match the first password input field."
                    : ""
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" disabled>
                          {validMatch && matchPwd ? <FontAwesomeIcon icon={faCheck} color="green" /> : <FontAwesomeIcon icon={faTimes} color="red" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                aria-invalid={validMatch ? "false" : "true"}
              />
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!validName || !validPwd || !validMatch || !validEmail}
              >
                Sign Up
              </Button>
            </Box>

            <Typography variant="body2" fontSize="12px" align="center" sx={{ mt: 2 }}>
              Already registered? <Link to="/login">Sign In</Link>
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Register;
