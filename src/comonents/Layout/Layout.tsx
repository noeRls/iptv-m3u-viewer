import React from 'react';
import { Header } from './Header';
import style from './layout.module.css';
import { Snackbar } from './Snackbar';

export const Layout: React.FC = ({ children }) => {
    return (
        <div className={style.container}>
            <div className={style.header}>
                <Header />
            </div>
            <div className={style.bodyContainer}>
                <div className={style.contentContainer}>{children}</div>
            </div>
            <Snackbar />
        </div>
    );
};
