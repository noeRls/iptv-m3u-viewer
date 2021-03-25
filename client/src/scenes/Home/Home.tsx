import React from 'react';
import { SyncRequestForm } from './SyncRequestForm/SyncRequestForm';
import { SyncRequestTimeline } from './SyncRequestTimeline';
import { Typography } from '@material-ui/core';

export const Home = () => (
    <>
        <Typography variant="h4" style={{ textAlign: 'left' }}>
            Synchronize your calendar
        </Typography>
        <SyncRequestForm />
        <SyncRequestTimeline />
    </>
);
