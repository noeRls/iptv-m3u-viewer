import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertProps } from '@material-ui/lab';
import { File, Filter } from 'types';
import { loadApp, loadFile } from './thunks';
import { STORAGE_KEY } from 'services/constants';
import { localStorageSet } from 'services/utils';

export interface AppSliceState {
    loaded: boolean,
    files: File[],
    permanentFilter: Filter[],
    temporaryFilter: Filter[],
    snakbar: {
        open: boolean,
        message?: string,
        severity?: AlertProps['severity'],
    };
}

const initialState: AppSliceState = {
    loaded: false,
    permanentFilter: [],
    temporaryFilter: [],
    files: [],
    snakbar: {
        open: false,
    },
};

const setSnackbarMessage = (state: AppSliceState, message: string, severity: AlertProps['severity']) => {
    state.snakbar = {
        ...state.snakbar,
        open: true,
        message,
        severity,
    };
};

export const appSlice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        snackbarVisibillityChanged: (state, action: PayloadAction<boolean>) => {
            state.snakbar.open = action.payload;
        },
        snackBarMessagePublished: (
            state,
            action: PayloadAction<{ message: string; severity: AlertProps['severity'] }>,
        ) => {
            setSnackbarMessage(state, action.payload.message, action.payload.severity);
        },
        addFilter: (state, { payload }: PayloadAction<{ permanent: boolean, filter: Filter }>) => {
            if (payload.permanent) {
                state.permanentFilter.push(payload.filter);
                localStorageSet(STORAGE_KEY.FILTERS, JSON.stringify(state.permanentFilter)).catch(console.error);
            } else {
                state.temporaryFilter.push(payload.filter);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadFile.fulfilled, (state, { payload }) => {
            state.files.push(payload);
            localStorageSet(STORAGE_KEY.FILES, JSON.stringify(state.files)).catch(console.error);
        });
        builder.addCase(loadFile.rejected, (state, { error }) => {
            console.error(error);
            setSnackbarMessage(state, 'Failed to load your file', 'error');
        });
        builder.addCase(loadApp.fulfilled, (state, { payload }) => {
            state.loaded = true;
            state.files = payload.files;
            state.permanentFilter = payload.filters;
        });
        builder.addCase(loadApp.rejected, (state, { error }) => {
            console.error(error);
            state.loaded = true;
            setSnackbarMessage(state, 'Failed to load the application', 'error');
        });
    },
});

export const {
    addFilter,
    snackBarMessagePublished,
    snackbarVisibillityChanged,
} = appSlice.actions;
