import React, { ChangeEvent, useCallback } from 'react';
import { FormControlLabel, InputAdornment, Switch, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setGroupNameFilter, setUsingPermanentFilter } from 'store/reducer';
import { Autocomplete } from '@material-ui/lab';
import { selectGroups, selectUsingPermanentFilter } from 'store/selector/entrys';
import style from './index.module.css';

export const QuickFilter = () => {
    const dispatch = useDispatch();
    const usingPermanentFilter = useSelector(selectUsingPermanentFilter);
    const groups = useSelector(selectGroups);
    const onSearchChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(e.target.value))
    }, [dispatch]);
    const onGroupNameChange = useCallback((e: ChangeEvent<unknown>, newValue: string | null) => {
        dispatch(setGroupNameFilter(newValue || ''));
    }, [dispatch]);
    const toogleUsePermanentFilter = useCallback(() => {
        dispatch(setUsingPermanentFilter(!usingPermanentFilter));
    }, [dispatch, usingPermanentFilter]);
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
                renderInput={(params) => <TextField {...params} label="Group" />}
            />
            <FormControlLabel
                label='Use filters'
                labelPlacement='start'
                control={<Switch checked={usingPermanentFilter} onChange={toogleUsePermanentFilter} />}
            />
        </div>
    )
}