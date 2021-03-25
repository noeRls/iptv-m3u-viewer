import React from 'react';
import { useSelector } from 'react-redux';
import { selectStudentGroupOptions } from 'store/selector/app';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { noop } from 'services/utils';

interface StudentGroupPickerProps {
    onChange?: (studentGroup: string[]) => void;
}

export const StudentGroupPicker = ({ onChange = noop }: StudentGroupPickerProps) => {
    const options = useSelector(selectStudentGroupOptions);
    return (
        <Autocomplete
            multiple
            options={options}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={(_, value) => onChange(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Student group"
                    placeholder="Select your student group(s)"
                />
            )}
        />
    );
};
