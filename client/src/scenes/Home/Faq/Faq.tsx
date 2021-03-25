import React, { useCallback, useState } from 'react';
import { Typography, Button, Tooltip } from '@material-ui/core';
import style from './Faq.module.css';
import { api } from 'services/api';
import { useSelector, useDispatch } from 'react-redux';
import { selectCalendar } from 'store/selector/app';
import { snackBarMessagePublished } from 'store/reducer';

export const Faq = () => {
    const calendar = useSelector(selectCalendar);
    const linkToGithub = (
        <a href="https://github.com/noeRls/heriot-watt-calendar-exporter" target="_blank" rel="noopener noreferrer">
            https://github.com/noeRls/heriot-watt-calendar-exporter
        </a>
    );
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const onDelete = useCallback(async () => {
        if (!calendar || !calendar.id || loading) {
            return;
        }
        try {
            setLoading(true);
            const { nbEventDeleted } = await api.deleteAllEvents(calendar?.id);
            if (nbEventDeleted > 0) {
                dispatch(
                    snackBarMessagePublished({ message: `Deleted ${nbEventDeleted} events`, severity: 'success' }),
                );
            } else {
                dispatch(snackBarMessagePublished({ message: `No events found`, severity: 'info' }));
            }
        } catch (e) {
            console.error(e);
            dispatch(snackBarMessagePublished({ message: `An error occured`, severity: 'error' }));
        } finally {
            setLoading(false);
        }
    }, [calendar, loading, setLoading, dispatch]);

    const getTooltipTitle = (): string => {
        if (loading) {
            return 'events are being deleted';
        } else if (!calendar || !calendar.id) {
            return 'Login and select a calendar';
        } else {
            return 'Delete all events';
        }
    };

    const deleteButton = (
        <Tooltip title={getTooltipTitle()} aria-label="delete">
            <span>
                <Button
                    onClick={onDelete}
                    disabled={!calendar || !calendar.id || loading}
                    variant="outlined"
                    color="secondary"
                >
                    Delete all events
                </Button>
            </span>
        </Tooltip>
    );

    const contents = [
        {
            title: 'What is this website?',
            messages: ['This website allow you to synchronize your heriot watt courses timeline to google agenda.'],
        },
        {
            title: 'Why is it asking full permission on my agenda?',
            messages: [
                'We need the permission to create new events on your agenda to add your heriot watt courses to it. There is no scope that allow only to create events, this is the level of permission we need to have.',
                <>
                    <span>
                        If you are concerned with any privacy issue, the code of this website is available here:{' '}
                    </span>
                    {linkToGithub}
                </>,
                'Google will automatically remove our access to your agenda after a week ro so if you do not connect to this website.',
            ],
        },
        {
            title: 'Can I remove all events created by heriot watt exporter?',
            messages: [
                'Yes you can remove all the events created by this website. You just need to select one of your calendar and click on this button.',
                deleteButton,
            ],
        },
        {
            title: 'Can I re-run a synchronisation?',
            messages: [
                'Yes, we are detecting the courses that are already in your agenda, we will not create them again if they exists.',
                'If for some reason courses are duplicated or new courses are not being sync-up, remove all of them thanks to the option above and re-run a synchronisation.',
            ],
        },
        {
            title: 'Is there a way to contact you?',
            messages: [
                'If you are facing a problem or you just want to send me some unicorn 🦄, you can contact me at noe.rivals@gmail.com',
            ],
        },
    ];

    return (
        <div className={style.container}>
            <Typography variant="h4">FAQ</Typography>
            {contents.map(({ messages, title }) => (
                <div key={title}>
                    <Typography variant="h6">{title}</Typography>
                    {messages.map((message, idx) => (
                        <p key={idx}>
                            <Typography>{message}</Typography>
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
};
