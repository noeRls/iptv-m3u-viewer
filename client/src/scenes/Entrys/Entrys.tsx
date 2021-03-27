import React from 'react';
import { Entry } from 'types';
import { EntryComponent } from './EntryComponent';
import style from './entrys.module.css'

export interface EntrysProps {
    entrys: Entry[];
}

export const Entrys = ({ entrys }: EntrysProps) => {
    return (
        <div className={style.container}>
            {entrys.map((entry) => <div key={entry.url} className={style.item}>
                <EntryComponent key={entry.url} entry={entry} />
            </div>)}
        </div>
    );
};
