import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, CreateSyncRequestParams } from '../../services/api';

export const fetchUser = createAsyncThunk('users/fetch', () => api.fetchUser());

export const fetchCalendar = createAsyncThunk('users/calendar', () => api.fetchCalendarList());

export const logout = createAsyncThunk('users/logout', () => api.logout());

export const createSyncRequest = createAsyncThunk('syncrequest/create', (args: CreateSyncRequestParams) =>
    api.createSyncRequest(args),
);

export const fetchSyncRequest = createAsyncThunk('syncrequest/fetch', (syncrequestId: number) =>
    api.fetchSyncRequest(syncrequestId),
);
