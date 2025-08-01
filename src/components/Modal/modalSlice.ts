import { createSlice } from '@reduxjs/toolkit';

type ModalState = {
  isOpen: boolean;
};

const initialState: ModalState = {
  isOpen: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    onOpenModal(state) {
      state.isOpen = true;
    },
    onCloseModal(state) {
      state.isOpen = false;
    },
  },
});

export const { onCloseModal, onOpenModal } = modalSlice.actions;
