import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import axios from '../../utils/axios';
import { loginSuccess } from '../../store/authSlice';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.get('login', {
        email,
        password,
      });

      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token,
      }));

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
