import { createSelector } from 'reselect'
import { selectAppState } from './app';
import { Entry, File, Filter } from 'types';

export const selectFileFilter = createSelector(selectAppState, state => state.fileFilter);
export const selectAllFiles = createSelector(selectAppState, state => state.files);
export const selectFiles = createSelector(
    selectAllFiles,
    selectFileFilter,
    (files, fileFilter): File[] => {
        if (!fileFilter || fileFilter.length === 0) {
            return files;
        }
        const file = files.find(file => file.name === fileFilter);
        return file ? [file] : [];
    }
);

export const selectPemanentFilter = createSelector(selectAppState, state => state.permanentFilter);

export const selectUsingPermanentFilter = createSelector(selectAppState, state => state.usingPermanentFilter);

export const selectSearch = createSelector(selectAppState, state => state.search);
export const selectGroupFilter = createSelector(selectAppState, state => state.groupFilter);
const selectTemporaryFilter = createSelector(
    selectGroupFilter,
    selectSearch,
    (groupName, search): Filter[] => {
        const filters: Filter[] = [];
        if (search.length > 0) {
            filters.push({ includeKeywords: search.split(' ') });
        }
        if (groupName.length > 0) {
            filters.push({ groupName });
        }
        return filters;
    }
);

export const selectFilters = createSelector(
    selectPemanentFilter,
    selectTemporaryFilter,
    selectUsingPermanentFilter,
    (permanentFilter, temporaryFilter, usingPermanentFilter): Filter[] =>
        usingPermanentFilter ? [...permanentFilter, ...temporaryFilter] : temporaryFilter,
)

export const selectAllGroups = createSelector(
    selectFiles,
    (files): string[] => Object.keys(files.reduce<Record<string, boolean>>((result, file) => {
        file.entrys.forEach(entry => result[entry.groupName] = true);
        return result;
    }, {})),
)

const filterEntrys = (entrys: Entry[], filters: Filter[]): Entry[] => {
    const filterWithGroupName = filters.filter(filter => filter.groupName);
    const filterWithoutGroupName = filters.filter(filter => !filter.groupName);

    const globalExclude = filterWithoutGroupName.reduce<string[]>((result, filter) => {
        if (!filter.excludeKeywords) {
            return result;
        }
        return [...result, ...filter.excludeKeywords];
    }, []);
    const globalInclude = filterWithoutGroupName.reduce<string[]>((result, filter) => {
        if (!filter.includeKeywords) {
            return result;
        }
        return [...result, ...filter.includeKeywords];
    }, []);

    return entrys.filter((entry => {
        const entryName = entry.name.toLowerCase();
        if (filterWithGroupName.length > 0) {
            const filter = filterWithGroupName.find(f => f.groupName === entry.groupName);
            if (!filter) {
                return false;
            }
            if (filter.includeKeywords && filter.includeKeywords.length > 0 &&
                !filter.includeKeywords.every(word => entryName.includes(word))
            ) {
                return false;
            }
            if (filter.excludeKeywords && filter.excludeKeywords.some(word => entryName.includes(word))) {
                return false;
            }
        }
        if (globalInclude.length > 0 && !globalInclude.every(word => entryName.includes(word))) {
            return false;
        }
        if (globalExclude.some(word => entryName.includes(word))) {
            return false;
        }
        return true;
    }));
};

export const selectEntry = createSelector(selectFiles, selectFilters,
    (files, filters): Entry[] => {
        return files.reduce<Entry[]>((result, file) => [
            ...result,
            ...filterEntrys(file.entrys, filters),
        ], []);
    }
)

export const selectGroups = createSelector(
    selectEntry,
    (entrys) => Object.keys(entrys.reduce<Record<string, boolean>>((result, entry) => {
        result[entry.groupName] = true;
        return result;
    }, {}))
)