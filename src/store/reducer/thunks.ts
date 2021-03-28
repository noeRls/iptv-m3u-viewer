import { createAsyncThunk } from '@reduxjs/toolkit';
import { parse } from 'iptv-playlist-parser';
import { STORAGE_KEY } from 'services/constants';
import { selectFiles } from 'store/selector/entrys';
import { RootState } from 'store/store';
import { File, Filter } from 'types';
import { localStoageGet, localStorageSet } from 'services/utils';

export const loadFile = createAsyncThunk('files/load', async ({ name, data }: { name: string, data: string }, thunkAPI): Promise<File> => {
    const file = parse(data);
    let savePath: string | null = null;
    const files = selectFiles(thunkAPI.getState() as RootState)
    for (let i = 0; ; i++) {
        savePath = `file:${name}${i}`;
        if (!files.some(f => f.savedPath === savePath)) {
            break;
        }
    }
    localStorageSet(savePath, data).catch(console.error);
    return {
        id: savePath,
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

