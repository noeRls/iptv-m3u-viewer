import React, { useCallback, useState } from 'react';
import { GoogleCalendarPicker } from './components/GoogleCalendarPicker';
import { CoursesPicker } from './components/CoursesPicker';
import { Button } from '@material-ui/core';
import { ColorPicker } from './components/ColorPicker';
import style from './SyncRequestForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectSyncRequestStatus, selectCalendar, selectColorId } from 'store/selector/app';
import { createSyncRequest } from 'store/reducer';
import { StudentGroupPicker } from './components/StudentGroupPicker';

export const SyncRequestForm = () => {
    const calendar = useSelector(selectCalendar);
    const [courses, setCourses] = useState<string[]>([]);
    const [studentGroups, setStudentGroups] = useState<string[]>([]);
    const dispatch = useDispatch();
    const syncRequestStatus = useSelector(selectSyncRequestStatus);
    const colorId = useSelector(selectColorId);

    const startSynchronisation = useCallback(() => {
        if (!calendar || !calendar.id || courses.length === 0 || studentGroups.length === 0) {
            return;
        }
        dispatch(
            createSyncRequest({
                calendarId: calendar.id,
                colorId,
                courses,
                studentGroups,
            }),
        );
    }, [calendar, courses, colorId, dispatch, studentGroups]);

    return (
        <div className={style.formItemContainer}>
            <GoogleCalendarPicker />
            <CoursesPicker onChange={setCourses} />
            <StudentGroupPicker onChange={setStudentGroups} />
            <ColorPicker />
            <Button
                disabled={
                    !calendar ||
                    !calendar.id ||
                    courses.length === 0 ||
                    syncRequestStatus === 'loading' ||
                    studentGroups.length === 0
                }
                variant="contained"
                color="primary"
                onClick={startSynchronisation}
            >
                Start synchronisation
            </Button>
        </div>
    );
};
