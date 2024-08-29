'use client';

import { request } from "@/server/actions";
import { useState, useCallback } from "react";

const useQuery = () => {
    const [queryState, setQueryState] = useState('idle');

    const query = useCallback((url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        return new Promise(async (resolve, reject) => {
            setQueryState('pending');

            try {
                const res = await request(url, method, body, headers);
                setQueryState('fulfilled');
                resolve(res);
            } catch (e) {
                setQueryState('error');
                reject(e);
                console.error(e);
            }
        });
    }, []);

    const resetQueryState = useCallback(() => setQueryState('idle'), []);

    return { queryState, query, resetQueryState };
}

export default useQuery;