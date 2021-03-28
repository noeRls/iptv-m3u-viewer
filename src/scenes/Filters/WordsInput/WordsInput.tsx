import { IconButton, InputAdornment, makeStyles, TextField } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/HighlightOff';
import { useDispatch } from 'react-redux';
import { snackBarMessagePublished } from 'store/reducer';
import style from './index.module.css';
import cx from 'classnames';

interface WordsInputProps {
    onChange: (newWords: string[]) => void
    words: string[]
    placeholder: string
    positive?: boolean
    negative?: boolean
}

const useStyleOverride = makeStyles(() => ({
    deleteIcon: {
        padding: '5px',
    },
    inputRoot: {
        flexWrap: 'wrap',
        minWidth: '300px'
    },
    inputInput: { width: '0px', minWidth: '140px', flexGrow: 1 },
}))

export const WordsInput = ({ words, onChange, placeholder, positive, negative }: WordsInputProps) => {
    const dispatch = useDispatch();
    const styleOverride = useStyleOverride();
    const [input, setInput] = useState<string>('');

    const onWordAdded = useCallback(() => {
        if (input.length === 0) {
            return;
        }
        if (words.includes(input)) {
            dispatch(snackBarMessagePublished({
                message: 'This word is already in the list',
                severity: 'info',
            }));
            return;
        }
        onChange([...words, input]);
        setInput('');
    }, [input, words, setInput, dispatch]);

    const onWordDelete = useCallback((word: string) => {
        onChange(words.filter(w => w !== word));
    }, [onChange, words]);

    return (
        <div className={style.container}>
            <TextField
                variant='outlined'
                label={placeholder}
                placeholder={words.length > 0 ? placeholder : undefined}
                value={input}
                onChange={e => setInput(e.target.value)}
                InputProps={{
                    classes: { root: styleOverride.inputRoot, input: styleOverride.inputInput },
                    startAdornment: words.length > 0 ?
                        <>
                            {words.map(word => (
                                <div
                                    key={word}
                                    className={cx({
                                        [style.word]: true,
                                        [style.positiveWord]: positive,
                                        [style.negativeWord]: negative,
                                    })}
                                >
                                    <span>
                                        {word}
                                    </span>
                                    <IconButton onClick={() => onWordDelete(word)} className={styleOverride.deleteIcon}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            ))}
                        </> : undefined,
                    endAdornment: <InputAdornment position='end'>
                        <IconButton onClick={onWordAdded}>
                            <AddIcon />
                        </IconButton>
                    </InputAdornment>
                }}
            />

        </div>
    )
};
