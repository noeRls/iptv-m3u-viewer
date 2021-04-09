import { Card, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Entry } from 'types';
import style from './entry.module.css';
import { snackBarMessagePublished, snackbarVisibillityChanged } from 'store/reducer'
import { selectAllFiles, selectFileFilter } from 'store/selector/entrys';
import { DisplayIf } from 'comonents/DisplayIf';

interface EntryComponentProps {
    entry: Entry;
}

export const EntryComponent = ({ entry }: EntryComponentProps) => {
    const dispatch = useDispatch();
    const fileFilter = useSelector(selectFileFilter);
    const files = useSelector(selectAllFiles);
    const shouldDisplayFile = fileFilter.length === 0 && files.length > 1;
    const onClick = useCallback(() => {
        navigator.clipboard.writeText(entry.url);
        dispatch(snackbarVisibillityChanged(false));
        setTimeout(() => {
            dispatch(snackBarMessagePublished({
                message: `Link Copied - ${entry.name}`,
                severity: 'success',
            }));
        }, 0);
    }, [entry, dispatch]);
    return (
        <Card className={style.container} onClick={onClick}>
            <Typography variant="h6">{entry.name}</Typography>
            <Typography>{entry.groupName}</Typography>
            <DisplayIf expr={shouldDisplayFile}>
                <Typography variant="caption">{entry.fileName}</Typography>
            </DisplayIf>
            <div className={style.imageContainer}>
                <img src={entry.logo} className={style.image} />
            </div>

        </Card>
    );
};
