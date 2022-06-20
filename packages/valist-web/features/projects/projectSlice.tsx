import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const defaultReadme = `# Example header

You can write Markdown here!`;

export interface ProjectState {
  account: string;
  name: string;
  displayName: string;
  price: string;
  limit: string;
  royalty: string;
  royaltyAddress: string;
  description: string;
  shortDescription: string;
  website: string;
  youtubeUrl: string;
  type: string;
  tags: string[],
  members: string[];
  pendingProjectID: string | null;
  pendingMemberChanged : string | null;
};

interface ProjectPayload {
  account: string;
  name: string;
  displayName: string;
  price: string;
  limit: string;
  royalty: string;
  royaltyAddress: string;
  description: string;
  shortDescription: string;
  website: string;
  youtubeUrl: string;
  type: string;
  tags: string[],
  members: string[];
  pendingProjectID: string | null;
  pendingMemberChanged : string | null;
}

const initialState: ProjectState = {
  account: '',
  name: '',
  displayName: '',
  price: '0',
  limit: '0',
  royalty: '0',
  royaltyAddress: '',
  description: defaultReadme,
  shortDescription: '',
  website: '',
  youtubeUrl: '',
  type: '',
  tags: [],
  members: [],
  pendingProjectID: null ,
  pendingMemberChanged: null,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
    setPendingProjectID: (state, action: PayloadAction<string | null>) => {
      state.pendingProjectID = action.payload;
    },
    setPendingMemberChanged: (state, action: PayloadAction<string | null>) => {
      state.pendingMemberChanged = action.payload;
    },
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setPrice: (state, action: PayloadAction<string>) => {
      state.price = action.payload;
    },
    setLimit: (state, action: PayloadAction<string>) => {
      state.limit = action.payload;
    },
    setRoyalty: (state, action: PayloadAction<string>) => {
      state.royalty = action.payload;
    },
    setRoyaltyAddress: (state, action: PayloadAction<string>) => {
      state.royaltyAddress = action.payload;
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
    setYouTubeUrl: (state, action: PayloadAction<string>) => {
      state.youtubeUrl = action.payload;
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
      state = action.payload;
    },
    clear: (state) => {
      state.account = '';
      state.displayName = '';
      state.name = '';
      state.price = '0';
      state.limit = '0';
      state.royalty = '0';
      state.royaltyAddress = '';
      state.description = defaultReadme;
      state.shortDescription = '';
      state.youtubeUrl = '';
      state.website = '';
      state.members = [];
      state.type = '';
      state.tags = [];
    },
  },
});

export const { 
  setAccount, setPendingProjectID,setPendingMemberChanged,setDisplayName, setName, setPrice, setLimit, setRoyalty, setRoyaltyAddress, setDescription, setShortDescription, setWebsite, setMembers, setYouTubeUrl, setType, setTags, addTag, removeTag, setAll, clear,
} = projectSlice.actions;
export const selectAccount = (state: RootState) => state.project.account;
export const selectDisplayName = (state: RootState) => state.project.displayName;
export const selectPrice = (state: RootState) => state.project.price;
export const selectLimit = (state: RootState) => state.project.limit;
export const selectRoyalty = (state: RootState) => state.project.royalty;
export const selectRoyaltyAddress = (state: RootState) => state.project.royaltyAddress;
export const selectName = (state: RootState) => state.project.name;
export const selectDescription = (state: RootState) => state.project.description;
export const selectShortDescription = (state: RootState) => state.project.shortDescription;
export const selectWebsite = (state: RootState) => state.project.website;
export const selectMembers = (state: RootState) => state.project.members;
export const selectYouTubeUrl = (state: RootState) => state.project.youtubeUrl;
export const selectType = (state: RootState) => state.project.type;
export const selectTags = (state: RootState) => state.project.tags;
export const selectPendingProjectID = (state: RootState) => state.project.pendingProjectID;
export const selectPendingMemberChanged = (state: RootState) => state.project.pendingMemberChanged;
export default projectSlice.reducer;
