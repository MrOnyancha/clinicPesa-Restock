import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Legacy hooks - keep for backward compatibility
type DispatchFunction = () => AppDispatch;

export const useModalDispatch: DispatchFunction = useDispatch;
export const useModalSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useTDispatch: DispatchFunction = useDispatch;
export const useTSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useInnerModalDispatch: DispatchFunction = useDispatch;
export const useInnerModalSelector: TypedUseSelectorHook<RootState> = useSelector;