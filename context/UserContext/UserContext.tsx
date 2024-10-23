import React, { createContext, useState, useContext } from 'react';


const UserContext = createContext({
    user: null,
    login: (userData: any) => { },
    logout: () => { },
});


export function UserProvider({ children }: any) {
    const [user, setUser] = useState(null);

    const login = (userData: any) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser() {
    return useContext(UserContext);
}
