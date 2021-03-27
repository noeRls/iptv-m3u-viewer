import React, { ChangeEvent, useCallback } from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setGroupNameFilter } from 'store/reducer';
import { Autocomplete } from '@material-ui/lab';
import { selectGroups } from 'store/selector/entrys';
import style from './index.module.css';

export const QuickFilter = () => {
    const dispatch = useDispatch();
    const groups = useSelector(selectGroups);
    const onSearchChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(e.target.value))
    }, [dispatch]);
    const onGroupNameChange = useCallback((e: ChangeEvent<unknown>, newValue: string | null) => {
        dispatch(setGroupNameFilter(newValue || ''));
    }, [dispatch]);
    return (
        <div className={style.container}>
            <TextField
                className={style.item}
                placeholder="Search..."
                InputProps={{
                    startAdornment: <InputAdornment position="start">
                        <SearchOutlined />
                    </InputAdornment>
                }}
                onChange={onSearchChanged}
            />
            <Autocomplete
                className={style.item}
                options={groups}
                onChange={onGroupNameChange}
                renderInput={(params) => <TextField {...params} label="Group Filter" />}
            />
        </div>
    )
}