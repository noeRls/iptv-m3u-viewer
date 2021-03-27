import { Button } from '@material-ui/core';
import React, { ChangeEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loadFile, snackBarMessagePublished } from 'store/reducer';
import style from './index.module.css';

export const FileUploader = () => {
    const dispatch = useDispatch();
    const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) {
            return;
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
            const content = reader.result as string;
            if (!content) {
                dispatch(snackBarMessagePublished({ message: 'Failed to load file', severity: 'error' }));
                return;
            }
            dispatch(loadFile({ name: file.name, data: content }))
        };
    }, [dispatch]);

    return <div>
        <input type='file' name='file' onChange={onFileChange} accept='.m3u' id="contained-button-file" className={style.fileUploadInput} />
        <label htmlFor="contained-button-file">
            <Button variant='contained' color='primary' component="span">
                Upload File
            </Button>
        </label>
    </div>
};
