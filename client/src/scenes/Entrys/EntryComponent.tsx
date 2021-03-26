import { Card, CardActionArea, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Entry } from 'types';
import style from './entry.module.css';

interface EntryComponentProps {
    entry: Entry;
}

export const EntryComponent = ({ entry }: EntryComponentProps) => {
    return (
            <Card className={style.container}>
                <div className={style.contentContainer}>
                    <Typography variant="h6">{entry.name}</Typography>
                    <Typography>Language: {entry.language}</Typography>
                    <Typography>Group: {entry.groupName}</Typography>
                </div>
                <div className={style.imageContainer}>
                    <img src={entry.logo} className={style.image} />
                </div>
            </Card>
    );
};
