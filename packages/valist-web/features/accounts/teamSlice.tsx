import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface TeamsState {
  username: string;
  displayName: string;
  description: string;
  website: string;
  beneficiary: string;
  members: string[];
  pendingTeamID: string | null;
};

interface TeamPayload {
  username: '';
  displayName: '';
  description: '';
  website: '';
  beneficiary: '';
  members: [];
  pendingTeamID: string | null;
}

const initialState: TeamsState = {
  username: '',
  displayName: '',
  description: '',
  website: '',
  beneficiary: '',
  members: [],
  pendingTeamID: null,
};

export const createTeamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPendingTeamID: (state, action: PayloadAction<string | null>) => {
      state.pendingTeamID = action.payload;
    },
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setWebsite: (state, action: PayloadAction<string>) => {
      state.website = action.payload;
    },
    setBeneficiary: (state, action: PayloadAction<string>) => {
      state.beneficiary = action.payload;
    },
    setMembers: (state, action: PayloadAction<string[]>) => {
      state.members = action.payload;
    },
    setAll: (state, action: PayloadAction<TeamPayload>) => {
      state.username =action.payload.username;
      state.displayName = action.payload.displayName;
      state.description = action.payload.description;
      state.website = action.payload.website;
      state.beneficiary = action.payload.beneficiary;
      state.members = action.payload.members;
    },
    clear: (state) => {
      state.username ='',
      state.displayName = '';
      state.description = '';
      state.website = '';
      state.beneficiary = '';
      state.members = [];
    },
  },
});

export const { 
  setUsername, setDisplayName, setDescription, setWebsite, setBeneficiary, setMembers, clear,setPendingTeamID,
} = createTeamSlice.actions;
export const selectUsername = (state: RootState) => state.team.username;
export const selectDisplayName = (state: RootState) => state.team.displayName;
export const selectDescription = (state: RootState) => state.team.description;
export const selectWebsite = (state: RootState) => state.team.website;
export const selectBeneficiary = (state: RootState) => state.team.beneficiary;
export const selectMembers = (state: RootState) => state.team.members;
export const selectPendingTeamID = (state: RootState) => state.team.pendingTeamID;
export default createTeamSlice.reducer;
