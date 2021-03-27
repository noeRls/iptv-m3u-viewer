import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertProps } from '@material-ui/lab';
import { File, Filter } from 'types';
import { loadApp, loadFile } from './thunks';
import { STORAGE_KEY } from 'services/constants';
import { localStorageSet } from 'services/utils';

export interface AppSliceState {
    loaded: boolean,
    files: File[],
    search: string
    groupFilter: string
    permanentFilter: Filter[],
    snakbar: {
        open: boolean,
        message?: string,
        severity?: AlertProps['severity'],
    };
}

const initialState: AppSliceState = {
    loaded: false,
    search: '',
    groupFilter: '',
    permanentFilter: [],
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
        addFilter: (state, { payload }: PayloadAction<Filter>) => {
            const cleanFilter: Filter = {
                excludeKeywords: payload.excludeKeywords?.map(w => w.toLowerCase()),
                includeKeywords: payload.includeKeywords?.map(w => w.toLowerCase()),
            }
            state.permanentFilter.push(cleanFilter);
            localStorageSet(STORAGE_KEY.FILTERS, JSON.stringify(state.permanentFilter)).catch(console.error);
        },
        setSearch: (state, { payload }: PayloadAction<string>) => {
            state.search = payload.toLowerCase();
        },
        setGroupNameFilter: (state, { payload }: PayloadAction<string>) => {
            state.groupFilter = payload;
        },
        deleteFile: (state, { payload }: PayloadAction<File>) => {
            const index = state.files.findIndex(file => file.id === payload.id);
            if (index === -1) {
                setSnackbarMessage(state, 'Failed to delete file', 'error');
                return;
            }
            state.files.splice(index, 1);
            localStorageSet(STORAGE_KEY.FILES, JSON.stringify(state.files)).catch(console.error);
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
    setSearch,
    deleteFile,
    setGroupNameFilter,
    snackBarMessagePublished,
    snackbarVisibillityChanged,
} = appSlice.actions;
