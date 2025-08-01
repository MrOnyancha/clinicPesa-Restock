import React from 'react';

interface LoginStatusProps {
  status: string | null;
}

const LoginStatus: React.FC<LoginStatusProps> = ({ status }) => {
  return (
    <div>
      {status && <div style={{ color: 'green' }}>{status}</div>}
    </div>
  );
};

export default LoginStatus;