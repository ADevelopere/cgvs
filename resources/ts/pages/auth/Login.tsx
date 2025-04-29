import React from 'react';
import GuestLayout from '@/components/layouts/GuestLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <GuestLayout>
      <LoginForm />
    </GuestLayout>
  );
};

export default Login;
