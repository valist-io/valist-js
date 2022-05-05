import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ReleaseState {
  team: string;
  project: string;
  name: string;
  description: string;
  licenses: string[];
};

const initialState: ReleaseState = {
  team: '',
  project: '',
  name: '',
  description: '',
  licenses: [],
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
    clear: (state) => {
      state.name = '';
      state.team = '';
      state.project = '';
      state.licenses = [];
      state.description = '';
    },
  },
});

export const { 
  setTeam, setProject, setName, setDescription, setLicenses, clear,
} = releaseSlice.actions;
export const selectTeam = (state: RootState) => state.release.team;
export const selectProject = (state: RootState) => state.release.project;
export const selectName = (state: RootState) => state.release.name;
export const selectDescription = (state: RootState) => state.release.description;
export const selectLicenses = (state: RootState) => state.release.licenses;
export default releaseSlice.reducer;
