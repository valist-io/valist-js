import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import accountReducer from '../features/accounts/accountsSlice';
import ensReducer from '../features/ens/ensSlice';
import licenseReducer from '../features/licenses/licenseSlice';
import modalReducer from '../features/modal/modalSlice';
import projectsReducer from '../features/projects/projectSlice';
import releaseReducer from '../features/releases/releaseSlice';
import teamsReducer from '../features/accounts/teamSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    team: teamsReducer,
    project: projectsReducer,
    release: releaseReducer,
    license: licenseReducer,
    ens: ensReducer,
    modal: modalReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
