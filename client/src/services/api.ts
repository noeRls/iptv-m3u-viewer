import Axios from 'axios';
import { User, SyncRequest } from '@prisma/client';
import { Calendar } from 'types';

export const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export interface CreateSyncRequestParams {
    calendarId: string;
    colorId?: number;
    courses: string[];
    studentGroups: string[];
}

export const api = {
    fetchUser: async (): Promise<User> => {
        const { data } = await axios.get('/me');
        return data;
    },
    fetchCalendarList: async (): Promise<Calendar[]> => {
        const { data } = await axios.get('/calendar/list');
        return data;
    },
    fetchCoursesOption: async (): Promise<string[]> => {
        const { data } = await axios.get('/courses/list');
        return data;
    },
    logout: async (): Promise<void> => {
        await axios.post('/logout');
    },
    createSyncRequest: async (params: CreateSyncRequestParams): Promise<SyncRequest> => {
        const { data } = await axios.post('/syncrequest', {
            ...params,
        });
        return data;
    },
    fetchSyncRequest: async (syncRequestId: number): Promise<SyncRequest> => {
        const { data } = await axios.get(`/syncrequest/${syncRequestId}`);
        return data;
    },
    deleteAllEvents: async (calendarId: string): Promise<{ nbEventDeleted: number }> => {
        const { data } = await axios.delete(`/courses/${calendarId}`);
        return data;
    },
};
