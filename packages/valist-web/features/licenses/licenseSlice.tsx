import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface LicenseState {
  team: string;
  project: string;
  name: string;
  description: string;
  price: string;
};

const initialState: LicenseState = {
  team: '',
  project: '',
  name: '',
  description: '',
  price: '',
};

export const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<string>) => {
      state.team = action.payload;
    },
    setProject: (state, action: PayloadAction<string>) => {
      state.project = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setPrice: (state, action: PayloadAction<string>) => {
      state.price = action.payload;
    },
  },
});

export const { 
  setTeam, setProject, setName, setDescription, setPrice,
} = licenseSlice.actions;
export const selectName = (state: RootState) => state.license.name;
export const selectTeam = (state: RootState) => state.license.team;
export const selectProject = (state: RootState) => state.license.project;
export const selectDescription = (state: RootState) => state.license.description;
export const selectPrice = (state: RootState) => state.license.price;
export default licenseSlice.reducer;
