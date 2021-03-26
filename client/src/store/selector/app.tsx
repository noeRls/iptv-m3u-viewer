import { RootState } from '../store';
import { createSelector } from 'reselect'

export const selectAppState = (state: RootState) => state.app;

export const selectAppIsLoaded = createSelector(selectAppState, (app) => app.loaded);

export const selectSnackbar = createSelector(selectAppState, (app) => app.snakbar);
