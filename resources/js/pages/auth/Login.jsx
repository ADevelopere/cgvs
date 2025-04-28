import React from 'react';
import GuestLayout from '../../components/layouts/GuestLayout';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  return (
    <GuestLayout>
      <LoginForm />
    </GuestLayout>
  );
};

export default Login;
