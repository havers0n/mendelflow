import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

const LoginForm: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onLogin && onLogin();
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ width: 320, mx: 'auto', mt: 8, p: 3, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>Вход</Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Пароль"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </Button>
    </Box>
  );
};

export default LoginForm;
