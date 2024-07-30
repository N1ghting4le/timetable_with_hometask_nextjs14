'use client';

import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGroups } from "@/server/actions";
import Error from "@/app/error";

const Context = createContext();

const GroupsContext = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const lastViewedGroup = localStorage.getItem('groupNum');

        if (lastViewedGroup) {
            router.push(`/${lastViewedGroup}`);
        }
    }, []);

    useEffect(() => {
        getGroups()
            .then(res => setGroups(res))
            .catch(err => {
                console.error(err);
                setIsError(true);
            });
    }, []);

    return isError ? <Error/> : (
        <Context.Provider value={{ groups }}>
            {children}
        </Context.Provider>
    );
}

export default GroupsContext;

const useGroups = () => useContext(Context).groups;

export { useGroups };