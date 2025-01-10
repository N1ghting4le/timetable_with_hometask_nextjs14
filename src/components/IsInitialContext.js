'use client';

import { useState, createContext, useContext } from "react";

const Context = createContext();

const IsInitialContext = ({ children }) => {
    const [isInitial, setIsInitial] = useState(true);

    return (
        <Context.Provider value={{ isInitial, setIsInitial }}>
            {children}
        </Context.Provider>
    );
}

export default IsInitialContext;

export const useIsInitial = () => useContext(Context);