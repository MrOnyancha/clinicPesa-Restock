import { createSlice } from '@reduxjs/toolkit';

type ModalState = {
  isOpen: boolean;
};

const initialState: ModalState = {
  isOpen: false,
};

export const innerModalSlice = createSlice({
  name: 'innerModal',
  initialState,
  reducers: {
    onOpenInnerModal(state) {
      state.isOpen = true;
    },
    onCloseInnerModal(state) {
      state.isOpen = false;
    },
  },
});

export const { onCloseInnerModal, onOpenInnerModal } = innerModalSlice.actions;
