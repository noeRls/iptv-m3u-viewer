import { createSelector } from 'reselect'
import { selectAppState } from './app';
import { Entry, Filter } from 'types';

export const selectFiles = createSelector(selectAppState, state => state.files);

const selectPemanentFilter = createSelector(selectAppState, state => state.permanentFilter);
const selectTemporaryFilter = createSelector(selectAppState, state => state.temporaryFilter);

export const selectFilters = createSelector(
    selectPemanentFilter,
    selectTemporaryFilter,
    (permanentFilter, temporaryFilter): Filter[] => [...permanentFilter, ...temporaryFilter],
)

const filterEntrys = (entrys: Entry[], filters: Filter[]): Entry[] => {
    const filterWithGroupName = filters.filter(filter => filter.groupName);
    const filterWithoutGroupName = filters.filter(filter => !filter.groupName);

    const globalInclude = filterWithoutGroupName.reduce<string[]>((result, filter) => {
        if (!filter.excludeKeywords) {
            return result;
        }
        return [...result, ...filter.excludeKeywords];
    }, []);
    const globalExclude = filterWithoutGroupName.reduce<string[]>((result, filter) => {
        if (!filter.includeKeywords) {
            return result;
        }
        return [...result, ...filter.includeKeywords];
    }, []);

    return entrys.filter((entry => {
        if (filterWithGroupName.length > 0) {
            const filter = filterWithGroupName.find(f => f.groupName === entry.groupName);
            if (!filter) {
                return false;
            }
            if (filter.includeKeywords && filter.includeKeywords.length > 0 &&
                !filter.includeKeywords.some(word => entry.name.includes(word))
            ) {
                return false;
            }
            if (filter.excludeKeywords && filter.excludeKeywords.some(word => entry.name.includes(word))) {
                return false;
            }
        }
        if (globalInclude.length > 0 && !globalInclude.some(word => entry.name.includes(word))) {
            return false;
        }
        if (globalExclude.some(word => entry.name.includes(word))) {
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