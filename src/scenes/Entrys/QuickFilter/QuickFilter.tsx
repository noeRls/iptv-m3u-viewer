import React, { ChangeEvent, useCallback } from 'react';
import { FormControlLabel, InputAdornment, makeStyles, Switch, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setGroupNameFilter, setUsingPermanentFilter, setFileFilter } from 'store/reducer';
import { Autocomplete } from '@material-ui/lab';
import { selectAllFiles, selectGroups, selectUsingPermanentFilter } from 'store/selector/entrys';
import style from './index.module.css';
import { File } from 'types';
import cl from 'classnames';

const useClasses = makeStyles(() => ({
    item: {
        padding: '0 10px',
    }
}));

export const QuickFilter = () => {
    const classes = useClasses();
    const dispatch = useDispatch();
    const usingPermanentFilter = useSelector(selectUsingPermanentFilter);
    const groups = useSelector(selectGroups);
    const files = useSelector(selectAllFiles);
    const onFileChange = useCallback((e: ChangeEvent<unknown>, newValue: File | null) => {
        dispatch(setFileFilter(newValue ? newValue.name : ''));
    }, [dispatch]);
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
                    className={cl(classes.item, style.item)}
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
            <Autocomplete
                className={style.item}
                options={files}
                onChange={onFileChange}
                getOptionLabel={file => file.name}
                renderInput={(params) => <TextField {...params} label="File" />}
            />
            <FormControlLabel
                label='Use filters'
                labelPlacement='start'
                control={<Switch checked={usingPermanentFilter} onChange={toogleUsePermanentFilter} />}
            />
        </div>
    )
}