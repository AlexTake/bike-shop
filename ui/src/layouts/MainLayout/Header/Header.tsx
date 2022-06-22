import React, {useEffect} from 'react';
import {AppBar, Badge, Box, IconButton, Menu, MenuItem} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import cl from './Header.module.css'
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../redux/store/user/slice";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {Typography} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {useNavigate} from "react-router";
import {PATH} from "../../../routes";

const Header = () => {

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const dispatch = useDispatch();
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const isMenuOpen = Boolean(anchorEl);

    const logoutAct = () => {
        dispatch(logout());
        setAnchorEl(null);
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={e=>navigate(PATH.ABOUT)}>Мої замовлення</MenuItem>
            <MenuItem onClick={logoutAct}>Вийти</MenuItem>
        </Menu>
    );

    return (
        <Box width={"100%"}>
            <AppBar position={"sticky"}>
                <Box display={"flex"} justifyContent={"space-around"} alignItems={"center"}>
                    <Typography
                        onClick={e=>navigate(PATH.CARS)}
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: {xs: 'none', sm: 'block', "&:hover":{cursor:"pointer"}}}}
                    >
                        ВелоПланета
                    </Typography>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    </Box>
                </Box>
            </AppBar>
            {renderMenu}
        </Box>
    );
};

export default Header;