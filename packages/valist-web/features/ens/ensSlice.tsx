import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface EnsState {
  nameByAddress: Record<string, string>;
  addressByName: Record<string, string>;
};

interface NamePayload {
  address: string,
  name: string,
}

const initialState: EnsState = {
  nameByAddress: {},
  addressByName: {},
};

export const EnsSlice = createSlice({
  name: 'ens',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<NamePayload>) => {
      state.addressByName[action.payload.name] = action.payload.address;
      state.nameByAddress[action.payload.address] = action.payload.name
    },
  },
});

export const { setName } = EnsSlice.actions;
export const selectNameByAddress = (state: RootState) => state.ens.nameByAddress;
export const selectAddressByName = (state: RootState) => state.ens.addressByName;
export default EnsSlice.reducer;