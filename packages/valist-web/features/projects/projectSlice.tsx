import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ProjectState {
  team: string;
  name: string;
  description: string;
  shortDescription: string;
  website: string;
  members: string[];
};

interface ProjectPayload {
  team: string;
  name: string;
  description: string;
  shortDescription: string;
  website: string;
  members: string[];
}

const initialState: ProjectState = {
  team: '',
  name: '',
  description: '',
  shortDescription: '',
  website: '',
  members: [],
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<string>) => {
      state.team = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setShortDescription: (state, action: PayloadAction<string>) => {
      state.shortDescription= action.payload;
    },
    setWebsite: (state, action: PayloadAction<string>) => {
      state.website = action.payload;
    },
    setMembers: (state, action: PayloadAction<string[]>) => {
      state.members = action.payload;
    },
    setAll: (state, action: PayloadAction<ProjectPayload>) => {
      state.team = action.payload.team;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.shortDescription = action.payload.shortDescription;
      state.website = action.payload.website;
      state.members = action.payload.members;
    },
  },
});

export const { 
  setTeam, setName, setDescription, setShortDescription, setWebsite, setMembers, setAll,
} = projectSlice.actions;
export const selectTeam = (state: RootState) => state.project.team;
export const selectName = (state: RootState) => state.project.name;
export const selectDescription = (state: RootState) => state.project.description;
export const selectShortDescription = (state: RootState) => state.project.shortDescription;
export const selectWebsite = (state: RootState) => state.project.website;
export const selectMembers = (state: RootState) => state.project.members;
export default projectSlice.reducer;
