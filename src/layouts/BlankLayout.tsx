import { useEffect } from 'react';
import { Outlet } from 'react-router';
import Cookies from 'js-cookie';

const BlankLayout: React.FC = () => {
  useEffect(() => {
    Cookies.remove('t_k');
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default BlankLayout;
