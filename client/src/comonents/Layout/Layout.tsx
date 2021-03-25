import React from 'react';
import { Header } from './Header';
import style from './layout.module.css';
import { Faq } from 'scenes/Home/Faq/Faq';
import cx from 'classnames';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { Snackbar } from './Snackbar';

export const Layout: React.FC = ({ children }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div className={style.container}>
            <Header />
            <div className={style.contentContainer}>
                <div className={style.contentBorder} />
                <div className={style.contentBody}>
                    {children}
                    {isSmallScreen && <Faq />}
                </div>
                {!isSmallScreen && (
                    <>
                        <div className={style.contentBorder} />
                        <div className={cx(style.contentBody, style.faq)}>
                            <Faq />
                        </div>
                    </>
                )}
                <div className={style.contentBorder} />
            </div>
            <Snackbar />
        </div>
    );
};
