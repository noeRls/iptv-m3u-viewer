import React from 'react';
import { useSelector } from 'react-redux';
import { selectFiles } from 'store/selector/entrys';
import { FileComponent } from './FileComponent';
import { FileUploader } from './FileUploader';
import style from './index.module.css'

export const Files = () => {
    const files = useSelector(selectFiles);
    return <div>
        <div className={style.filesContainer}>
        {files.map(file => <FileComponent key={file.id} file={file} />)}
        </div>
        <FileUploader />
    </div>
};
