import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const defaultReadme = `# Example header

You can write Markdown here!`;

export interface ProjectState {
  team: string;
  name: string;
  displayName: string;
  description: string;
  shortDescription: string;
  website: string;
  type: string;
  tags: string[],
  members: string[];
};

interface ProjectPayload {
  team: string;
  name: string;
  displayName: string;
  description: string;
  shortDescription: string;
  website: string;
  type: string;
  tags: string[],
  members: string[];
}

const initialState: ProjectState = {
  team: '',
  name: '',
  displayName: '',
  type: '',
  tags: [],
  description: defaultReadme,
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
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
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
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    addTag: (state, action: PayloadAction<string>) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<string>) => {
      const index = state.tags.indexOf(action.payload);
      state.tags = state.tags.splice(index, 1);
    },
    setAll: (state, action: PayloadAction<ProjectPayload>) => {
      state.team = action.payload.team;
      state.name = action.payload.name;
      state.displayName = action.payload.displayName;
      state.description = action.payload.description;
      state.shortDescription = action.payload.shortDescription;
      state.website = action.payload.website;
      state.members = action.payload.members;
    },
    clear: (state) => {
      state.team = '';
      state.displayName = '';
      state.name = '';
      state.description = defaultReadme;
      state.shortDescription = '';
      state.website = '';
      state.members = [];
      state.type = '';
      state.tags = [];
    },
  },
});

export const { 
  setTeam, setDisplayName, setName, setDescription, setShortDescription, setWebsite, setMembers, setType, setTags, addTag, removeTag, setAll, clear,
} = projectSlice.actions;
export const selectTeam = (state: RootState) => state.project.team;
export const selectDisplayName = (state: RootState) => state.project.displayName;
export const selectName = (state: RootState) => state.project.name;
export const selectDescription = (state: RootState) => state.project.description;
export const selectShortDescription = (state: RootState) => state.project.shortDescription;
export const selectWebsite = (state: RootState) => state.project.website;
export const selectMembers = (state: RootState) => state.project.members;
export const selectType = (state: RootState) => state.project.type;
export const selectTags = (state: RootState) => state.project.tags;
export default projectSlice.reducer;
