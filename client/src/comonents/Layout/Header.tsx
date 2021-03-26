import React, { useCallback } from 'react';
import {
    AppBar,
    IconButton,
    Link,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { FilterList, Description } from '@material-ui/icons';
import ListIcon from '@material-ui/icons/List';
import { urls } from 'services/urls';
import { useHistory } from 'react-router';

const useStyle = makeStyles({
    listIcon: {
        color: 'white',
    },
});

export const Header = () => {
    const overrideStyle = useStyle();
    const history = useHistory();
    const navigationItems = [
        {
            url: urls.home,
            icon: <ListIcon />,
            text: 'Channels',
        },
        {
            url: urls.filters,
            icon: <FilterList />,
            text: 'Filters',
        },
        {
            url: urls.files,
            icon: <Description />,
            text: 'Files',
        },
    ];

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">M3U Viewer</Typography>
                {navigationItems.map((item) => (
                    <div key={item.text} onClick={() => history.push(item.url)}>
                        <MenuItem>
                            <ListItemIcon className={overrideStyle.listIcon}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </MenuItem>
                    </div>
                ))}
            </Toolbar>
        </AppBar>
    );
};
