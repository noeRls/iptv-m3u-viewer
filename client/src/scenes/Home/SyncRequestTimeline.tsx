import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSyncRequest, selectSyncRequestStatus } from 'store/selector/app';
import { fetchSyncRequest } from 'store/reducer';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot as TimelineDotOriginal,
    TimelineContent,
    TimelineConnector,
    TimelineDotProps as TimelineDotOriginalProps,
    TimelineOppositeContent,
} from '@material-ui/lab';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import style from './SyncRequestTimeline.module.css';
import { SyncRequest } from '@prisma/client';

interface TimelineDotProps extends TimelineDotOriginalProps {
    status: 'error' | 'active' | 'done' | 'inactive';
}

const useClasses = makeStyles(() =>
    createStyles({
        defaultPrimary: {
            backgroundColor: 'green',
        },
    }),
);

const TimelineDot = ({ status, ...other }: TimelineDotProps) => {
    const classes = useClasses();
    if (status === 'active') {
        return (
            <>
                <div className={style.loadingDot} />
                <TimelineDotOriginal color="grey" />
            </>
        );
    }
    const getColor = (status: TimelineDotProps['status']): TimelineDotOriginalProps['color'] => {
        switch (status) {
            case 'active':
                return 'grey';
            case 'done':
                return 'primary';
            case 'error':
                return 'secondary';
            case 'inactive':
                return 'grey';
        }
    };

    return (
        <TimelineDotOriginal classes={{ defaultPrimary: classes.defaultPrimary }} {...other} color={getColor(status)} />
    );
};

export const SyncRequestTimeline = () => {
    const dispatch = useDispatch();
    const syncRequest = useSelector(selectSyncRequest);
    const syncRequestStatus = useSelector(selectSyncRequestStatus);

    useEffect(() => {
        if (syncRequestStatus !== 'loading' || !syncRequest) {
            return;
        }
        const fetchIt = () => {
            dispatch(fetchSyncRequest(syncRequest.id));
        };
        const interval = setInterval(fetchIt, 5 * 1000);
        return () => clearInterval(interval);
    }, [syncRequestStatus, syncRequest, dispatch]);

    const steps = [
        {
            name: 'Start synchronisation',
            expr: syncRequestStatus !== 'none' && syncRequest,
        },
        {
            name: 'Fetch your courses timeline (~1min)',
            expr: syncRequest && syncRequest.coursesFound !== null,
            finalText: (syncRequest: SyncRequest) => `${syncRequest.coursesFound} courses fetched`,
        },
        {
            name: 'Add courses to your calendar (~1min)',
            expr: syncRequest && syncRequest.coursesAdded !== null,
            finalText: (syncRequest: SyncRequest) => `${syncRequest.coursesAdded} courses added to your calendar`,
        },
    ];

    let nextActive = syncRequestStatus !== 'none';
    return (
        <Timeline>
            {steps.map((step, idx) => {
                let status: TimelineDotProps['status'];
                if (step.expr) {
                    status = 'done';
                } else {
                    if (nextActive) {
                        status = syncRequestStatus === 'error' ? 'error' : 'active';
                        nextActive = false;
                    } else {
                        status = 'inactive';
                    }
                }
                return (
                    <TimelineItem key={step.name}>
                        {syncRequest && step.finalText && status === 'done' && (
                            <TimelineOppositeContent>
                                <Typography color="textSecondary">{step.finalText(syncRequest)}</Typography>
                            </TimelineOppositeContent>
                        )}
                        <TimelineSeparator>
                            <TimelineDot status={status} />
                            {idx + 1 !== steps.length && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>{step.name}</TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );
};
