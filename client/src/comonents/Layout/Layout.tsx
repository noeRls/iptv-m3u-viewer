import React from 'react';
import { Header } from './Header';
import style from './layout.module.css';
import { Snackbar } from './Snackbar';

export const Layout: React.FC = ({ children }) => {
    return (
        <div className={style.container}>
            <Header />
            <div className={style.contentContainer}>
                <div className={style.contentBody}>{children}</div>
            </div>
            <Snackbar />
        </div>
    );
};
