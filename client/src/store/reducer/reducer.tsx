import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, SyncRequest } from '@prisma/client';
import { Calendar } from 'types';
import coursesOption from 'generated/coursesOption.json';
import studentGroupOptions from 'generated/studentGroups.json';
import { fetchCalendar, fetchUser, logout, createSyncRequest, fetchSyncRequest } from './thunks';
import { AlertProps } from '@material-ui/lab';

export interface AppSliceState {
    calendarColorId?: number;
    user?: User;
    loaded: boolean;
    calendars: Record<string, Calendar>;
    coursesOption: string[];
    studentGroupOptions: string[];
    syncRequest: {
        status: 'none' | 'loading' | 'error' | 'done';
        detail?: SyncRequest;
    };
    selection: {
        calendarId?: string;
    };
    snakbar: {
        open: boolean;
        message?: string;
        severity?: AlertProps['severity'];
    };
}

const initialState: AppSliceState = {
    loaded: false,
    calendars: {},
    studentGroupOptions,
    syncRequest: { status: 'none' },
    coursesOption,
    selection: {},
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
        selectedCalendarChanged: (state, action: PayloadAction<string | undefined>) => {
            state.selection.calendarId = action.payload;
        },
        snackbarVisibillityChanged: (state, action: PayloadAction<boolean>) => {
            state.snakbar.open = action.payload;
        },
        snackBarMessagePublished: (
            state,
            action: PayloadAction<{ message: string; severity: AlertProps['severity'] }>,
        ) => {
            setSnackbarMessage(state, action.payload.message, action.payload.severity);
        },
        setColorId: (state, action: PayloadAction<number | undefined>) => {
            state.calendarColorId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCalendar.fulfilled, (state, action) => {
            state.calendars = action.payload.reduce<Record<string, Calendar>>((acc, calendar) => {
                if (!calendar.id) {
                    console.error('Calendar do not have an id', calendar);
                    return acc;
                }
                acc[calendar.id] = calendar;
                return acc;
            }, {});
        });
        builder.addCase(fetchCalendar.rejected, (state, action) => {
            state.user = undefined;
            console.error(action.error);
        });

        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loaded = true;
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            console.error(action.error);
            state.user = undefined;
            state.loaded = true;
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.user = undefined;
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.user = undefined;
            console.error(action.error);
            setSnackbarMessage(state, 'Failed to contact the server on logout', 'info');
        });

        builder.addCase(createSyncRequest.pending, (state) => {
            state.syncRequest.status = 'loading';
            state.syncRequest.detail = undefined;
        });
        builder.addCase(createSyncRequest.fulfilled, (state, action) => {
            state.syncRequest.detail = action.payload;
            state.syncRequest.status = 'done';
            setSnackbarMessage(state, 'Synchronisation started', 'success');
        });
        builder.addCase(createSyncRequest.rejected, (state, action) => {
            state.syncRequest.status = 'error';
            if (action.error.message?.includes('403')) {
                setSnackbarMessage(state, 'Rate limit exceed, retry tomorrow', 'error');
            } else if (action.error.message?.includes('401')) {
                setSnackbarMessage(state, 'Connection lost, refresh the page', 'error');
            } else {
                setSnackbarMessage(state, 'Failed to create the synchronisation request', 'error');
            }
        });

        builder.addCase(fetchSyncRequest.fulfilled, (state, action) => {
            state.syncRequest.detail = action.payload;
        });
        builder.addCase(fetchSyncRequest.rejected, (state, action) => {
            state.syncRequest.status = 'error';
            setSnackbarMessage(state, 'An error occured', 'error');
            console.error(action.error);
        });
    },
});

export const {
    selectedCalendarChanged,
    snackBarMessagePublished,
    snackbarVisibillityChanged,
    setColorId,
} = appSlice.actions;
