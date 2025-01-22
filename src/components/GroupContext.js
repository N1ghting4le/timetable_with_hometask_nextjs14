'use client';

import { LOCAL_STORAGE_GROUP_NUM } from "@/env/env";
import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGroups } from "@/server/actions";
import Error from "@/app/error";

const Context = createContext();

const GroupContext = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const lastViewedGroup = localStorage.getItem(LOCAL_STORAGE_GROUP_NUM);

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

export default GroupContext;

export const useGroups = () => useContext(Context).groups;