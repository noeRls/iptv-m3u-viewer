import { Card, IconButton } from '@material-ui/core';
import React, { useCallback } from 'react';
import DownloadIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import { snackBarMessagePublished, deleteFile } from 'store/reducer';
import { localStoageGet } from 'services/utils';
import { File } from 'types';
import fileDownload from 'js-file-download';
import style from './index.module.css';

interface FileComponentProps {
    file: File
}

export const FileComponent = ({ file }: FileComponentProps) => {
    const dispatch = useDispatch();
    const onDownload = useCallback(async () => {
        try {
            const data = await localStoageGet(file.savedPath);
            if (!data) {
                throw new Error('Could not find file data');
            }
            fileDownload(data, file.name);
        } catch (e) {
            dispatch(snackBarMessagePublished({
                message: 'Failed to download file',
                severity: 'error',
            }));
        }
    }, [dispatch, file])
    const onDelete = useCallback(() => {
        dispatch(deleteFile(file));
    }, [dispatch, file]);
    return (
        <Card className={style.fileCard}>
            <span>
                {file.name}
            </span>
            <IconButton onClick={onDownload}>
                <DownloadIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
                <DeleteIcon />
            </IconButton>
        </Card>
    )
}