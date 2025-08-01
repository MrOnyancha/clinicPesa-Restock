import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  // setUserRole,
  setUserType,
  UserType,
} from '@/pages/auth/authSlice';

const RoleSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const currentRole = useSelector((state: RootState) => state.auth.user?.role);

  const roles: UserType[] = ['IT', 'dispenser', 'admin', 'manager', 'supervisor', 'restocking', 'reconciliation'];

  // Set default role when component mounts or role changes
  useEffect(() => {
    // Get saved role from localStorage or default to 'dispenser'
    const savedRole = localStorage.getItem('userRole') || 'dispenser';

    // If current role is different from saved role, update it
    if (currentRole !== savedRole) {
      dispatch(setUserType(savedRole as UserType));
    }
  }, [dispatch, currentRole]);

  // console.log('RoleSwitcher - Current Role:', currentRole);

  // Handler for role switching
  const handleRoleSwitch = (role: UserType) => {
    // Save selected role to localStorage
    localStorage.setItem('userRole', role);
    dispatch(setUserType(role));
  };

  return process.env.NODE_ENV === 'development' ? (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="text-sm font-semibold mb-2">Development Role Switcher</h3>
      <div className="flex flex-col gap-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSwitch(role)}
            className={`px-3 py-1 rounded text-sm ${
              currentRole === role ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  ) : null;
};

export default RoleSwitcher;
