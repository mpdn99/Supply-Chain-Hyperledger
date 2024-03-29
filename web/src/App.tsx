﻿import React, { createContext, ReactNode, useState } from 'react';
import './index.css';

export const AuthContext = createContext({} as utilsProps);

interface Props {
    children: ReactNode
}

interface utilsProps {
    token: tokenProps,
    err: boolean,
    handleLogin: any,
    handleLogout: any
}

interface tokenProps {
    Name: string;
    UserId: string;
    Email: string;
    UserType: string;
    Organization: string;
    ManufacturerOrg: string;
    Address: string;
}

const App: React.FC<Props> = ({children}) => {
    const [token, setToken] = useState(null);
    const [err, setErr] = useState(false);

    const handleLogin = (username: any, password: any) => {
        fetch(`https://customer.ducnghiapham.online/query?channelid=supplychain&chaincodeid=supplychain&function=signIn&args=${username}&args=${password}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(respose => respose.json())
            .then(data => {
                setToken(data)
            })
            .catch(() => setErr(true))
    }

    const handleLogout = () => {
        setToken(null)
    }

    const utils:any = {
        token,
        err,
        setErr,
        handleLogin,
        handleLogout
    }

    return (
            <AuthContext.Provider value={utils}>
                {children}
            </AuthContext.Provider>
    )
}

export default App;