import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

const useRolesAndPermissions = () => {
  // const userRole = useAppSelector((state: RootState) => state?.auth?.user?.role);
  const userRole = localStorage.getItem('adsRole')

  const IS_CASHIER = userRole === 'DISPENSER';
  const IS_ADMIN = userRole === 'ADMIN';
  const IS_IT = userRole === 'IT';
  const IS_SUPERVISOR = userRole === 'SUPERVISOR';
  const IS_RESTOCK = userRole === 'RESTOCKING';
  const IS_MANAGER = userRole === 'MANAGER';
  const IS_RECONCILIATION = userRole === 'RECONCILIATION';

  const VIEW_ALL_SALES_PERMISSIONS =
    IS_ADMIN || IS_IT || IS_RESTOCK || IS_MANAGER || IS_SUPERVISOR || IS_RECONCILIATION;

  return {
    IS_ADMIN,
    IS_CASHIER,
    IS_IT,
    IS_SUPERVISOR,
    IS_RESTOCK,
    IS_MANAGER,
    IS_RECONCILIATION,
    VIEW_ALL_SALES_PERMISSIONS,
  };
};

export default useRolesAndPermissions;
