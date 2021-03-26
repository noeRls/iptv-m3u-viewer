// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop: () => void = () => {};

import { get, set } from 'idb-keyval';

export const localStorageSet = (key: string, data: string): Promise<void> => {
    return set(key, data);
}

export const localStoageGet = (key: string): Promise<string | null | undefined> => {
    return get(key);
}