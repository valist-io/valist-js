import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ReleaseState {
  team: string;
  project: string;
  name: string;
  description: string;
  licenses: string[];
  availableLicenses: string[];
};

const initialState: ReleaseState = {
  team: '',
  project: '',
  name: '',
  description: '',
  licenses: [],
  availableLicenses: [],
};

export const releaseSlice = createSlice({
  name: 'release',
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
    setLicenses: (state, action: PayloadAction<string[]>) => {
      state.licenses = action.payload;
    },
    setAvailableLicenses: (state, action: PayloadAction<string[]>) => {
      state.availableLicenses = action.payload;
    },
  },
});

export const { 
  setTeam, setProject, setName, setDescription, setLicenses, setAvailableLicenses
} = releaseSlice.actions;
export const selectTeam = (state: RootState) => state.release.team;
export default releaseSlice.reducer;
