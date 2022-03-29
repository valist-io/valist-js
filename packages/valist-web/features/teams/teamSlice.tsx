import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface TeamsState {
  name: string;
  description: string;
  website: string;
  beneficiary: string;
  members: string[];
};

interface TeamPayload {
  name: '',
  description: '',
  website: '',
  beneficiary: '',
  members: [],
}

const initialState: TeamsState = {
  name: '',
  description: '',
  website: '',
  beneficiary: '',
  members: [],
};

export const createTeamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
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
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.website = action.payload.website;
      state.beneficiary = action.payload.beneficiary;
      state.members = action.payload.members;
    },
  },
});

export const { 
  setName, setDescription, setWebsite, setBeneficiary, setMembers
} = createTeamSlice.actions;
export const selectName = (state: RootState) => state.team.name;
export const selectDescription = (state: RootState) => state.team.description;
export const selectWebsite = (state: RootState) => state.team.website;
export const selectBeneficiary = (state: RootState) => state.team.beneficiary;
export const selectMembers = (state: RootState) => state.team.members;
export default createTeamSlice.reducer;
