import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ModalState {
  isOpen: boolean;
  view: string;
};

const initialState: ModalState = {
  isOpen: false,
  view: 'login',
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    close: (state) => {
      state.isOpen = false;
    },
    showLogin: (state) => {
      state.view = 'login';
      state.isOpen = true;
    },
    setView: (state, action: PayloadAction<string>) => {
      state.view = action.payload;
    },
  },
});

export const { toggle, close, showLogin, setView } = modalSlice.actions;
export const selectIsOpen = (state: RootState) => state.modal.isOpen;
export const selectView = (state: RootState) => state.modal.view;
export default modalSlice.reducer;
