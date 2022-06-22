import React from 'react';
import './App.css';
import {Box, createTheme, ThemeProvider} from "@mui/material";
import {SelectUserAuth} from "./redux/store/user/selector";
import {useDispatch, useSelector} from "react-redux";
import {login, setAuth, setUser} from "./redux/store/user/slice";
import {useRoutes} from "react-router";
import routes from "./routes";

function App() {
    const auth = useSelector(SelectUserAuth);
    const dispatch = useDispatch();
    if (localStorage.getItem('carShop') && !auth) {
        const item = JSON.parse(localStorage.getItem('carShop'));
        dispatch(login({login: item.login, password: item.password}));
    }

    const newTheme = createTheme({
        palette: {
            primary: {
                main: "#0a9b55"
            }
        }
    })

    const content = useRoutes(routes[!auth ? 0 : 1]);

    return (
        <Box>
            <ThemeProvider theme={newTheme}>
                {content}
            </ThemeProvider>
        </Box>
    );
}

export default App;
