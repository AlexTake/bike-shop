import React, {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";
import {CircularProgress} from "@mui/material";

const Loader = (Component) => (props) =>
    (
        <Suspense fallback={<CircularProgress/>}>
            <Component {...props} />
        </Suspense>
    );

const Authorization = Loader(lazy(() => import('./pages/Auth/Authorization')))
const Registration = Loader(lazy(() => import('./pages/Register/Registration')))
const Layout = Loader(lazy(() => import('./layouts/MainLayout/Index')))
const Catalog = Loader(lazy(() => import('./pages/About/Catalog')))
const TestDrives = Loader(lazy(() => import('./pages/TestDrives/TestDrives')))

export const PATH = {
    AUTHORIZATION: "/auth",
    REGISTER: "/register",
    ABOUT: "/main/testdrives",
    CARS: "/main/catalog",
}

const routes = [
    [
        {
            path: "*",
            element: <Navigate to={"/register"}/>
        },
        {
            path: "auth",
            element: <Authorization/>
        },
        {
            path: "register",
            element: <Registration/>
        },
    ],
    [
        {
            path: "main",
            element: <Navigate to={"/main/catalog"}/>
        },
        {
            path: "main",
            element: <Layout/>,
            children:[
                {
                    path: "catalog",
                    element: <Catalog/>
                },
                {
                    path: "testdrives",
                    element: <TestDrives/>
                },
            ]
        },
        {
            path: "*",
            element: <Navigate to={"/main/catalog"}/>
        },
    ]


]

export default routes;
