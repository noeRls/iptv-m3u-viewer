import React from 'react';
import { useSelector } from 'react-redux';
import { selectCoursesOption } from 'store/selector/app';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { noop } from 'services/utils';

interface CoursesPickerProps {
    onChange?: (courses: string[]) => void;
}

export const CoursesPicker = ({ onChange = noop }: CoursesPickerProps) => {
    const options = useSelector(selectCoursesOption);
    return (
        <Autocomplete
            multiple
            options={options}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={(_, value) => onChange(value)}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Courses" placeholder="Select your courses" />
            )}
        />
    );
};
