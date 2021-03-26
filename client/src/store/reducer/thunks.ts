import { createAsyncThunk } from '@reduxjs/toolkit';
import { parse } from 'iptv-playlist-parser';
import { STORAGE_KEY } from 'services/constants';
import { selectFiles } from 'store/selector/entrys';
import { RootState } from 'store/store';
import { File, Filter } from 'types';
import { localStoageGet, localStorageSet } from 'services/utils';

export const loadFile = createAsyncThunk('files/load', async ({ name, data }: { name: string, data: string }, thunkAPI): Promise<File> => {
    const files = selectFiles(thunkAPI.getState() as RootState)
    console.log('hello');
    if (files.some(file => file.name === name)) {
        // TODO give user feedback
        console.log('existing!!!');
        throw new Error('File with the same name exists');
    }
    const file = parse(data);
    const savePath = STORAGE_KEY.ROW_FILE(name);
    localStorageSet(savePath, data).catch(console.error);
    return {
        name,
        savedPath: savePath,
        entrys: file.items.map(item => ({
            groupName: item.group.title,
            logo: item.tvg.logo,
            language: item.tvg.language,
            name: item.name,
            url: item.url,
            contry: item.tvg.country
        })),
    }
});

export const loadApp = createAsyncThunk('load', async (): Promise<{ filters: Filter[], files: File[] }> => {
    const files = await localStoageGet(STORAGE_KEY.FILES);
    const filters = await localStoageGet(STORAGE_KEY.FILTERS);
    return {
        files: files ? JSON.parse(files) as File[] : [],
        filters: filters ? JSON.parse(filters) as Filter[] : []
    };
});

