import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetOrder, PostLogin} from "../../../api/Api";

export enum Statuses {
    none = "none",
    waiting = "waiting",
    success = "success",
    error = "error"
}


export interface UserState {
    isAuth: boolean,
    account: User
    errorMsg: string
}

const INITIAL_STATE = {
    account: {} as User,
    isAuth: false,
    errorMsg: ""
};

interface User{
    login: string,
    password: string
}

const userSlice = createSlice({
    name: "user",
    initialState: INITIAL_STATE,
    reducers: {
        login(state, action:PayloadAction<PostLogin>) {
            state.account = {} as User;
            state.isAuth = false;
            state.errorMsg = "";
        },
        setAuth: (state, action) => {
            state.isAuth = action.payload;
        },
        setUser: (state, action) => {
            state.account = action.payload;
        },
        logout: (state) => {
            console.log("logout")
        },
        setError: (state, action:PayloadAction<string>) => {
            state.errorMsg = action.payload;
        },
    }
})

export default userSlice.reducer;
export const { setUser, setAuth, login, logout, setError } = userSlice.actions;
