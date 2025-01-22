'use client';

import { LOCAL_STORAGE_GROUP_NUM } from "@/env/env";
import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGroups } from "@/server/actions";
import Loading from "./loading/Loading";
import Error from "@/app/error";

const Context = createContext();

const GroupContext = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
            })
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <Loading/>;
    if (isError) return <Error/>;

    return (
        <Context.Provider value={{ groups }}>
            {children}
        </Context.Provider>
    );
}

export default GroupContext;

export const useGroups = () => useContext(Context).groups;