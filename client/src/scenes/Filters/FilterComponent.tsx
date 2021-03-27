import { Card, IconButton, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllGroups } from 'store/selector/entrys';
import { Filter } from 'types';
import style from './index.module.css'
import { WordsInput } from './WordsInput/WordsInput';
import { modifyFilter, deleteFilter } from 'store/reducer';
import DeleteIcon from '@material-ui/icons/Delete';

export interface FilterComponentProps {
    filter: Filter
    index: number
}

export const FilterComponent = ({ filter, index }: FilterComponentProps) => {
    const groups = useSelector(selectAllGroups);
    const dispatch = useDispatch();
    const onExcludeListChange = (excludeKeywords: string[]) => {
        dispatch(modifyFilter({
            index,
            update: { ...filter, excludeKeywords },
        }));
    };
    const onIncludeListChange = (includeKeywords: string[]) => {
        dispatch(modifyFilter({
            index,
            update: { ...filter, includeKeywords },
        }));
    }
    const onGroupNameChange = (groupName: string | null) => {
        dispatch(modifyFilter({
            index,
            update: { ...filter, groupName: groupName ? groupName : undefined },
        }));
    }
    const onDelete = () => {
        dispatch(deleteFilter(index));
    }
    return (
        <Card className={style.filterCard}>
            <WordsInput
                positive
                words={filter.includeKeywords || []}
                onChange={onIncludeListChange}
                placeholder='Include Keyword'
            />
            <WordsInput
                negative
                words={filter.excludeKeywords || []}
                onChange={onExcludeListChange}
                placeholder='Exclude keyword'
            />
            <Autocomplete
                onChange={(_, value) => onGroupNameChange(value)}
                defaultValue={filter.groupName}
                className={style.groupFilter}
                options={groups}
                renderInput={(params) => <TextField {...params} variant='outlined' label="Group Filter (All by default)" />}
            />
            <IconButton onClick={onDelete}>
                <DeleteIcon />
            </IconButton>
        </Card>
    )
}