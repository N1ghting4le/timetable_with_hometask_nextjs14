import { useCallback } from "react";

const useGetPosition = () => {
    const getPosition = useCallback((e, offset = 0) => {
        let x = e.clientX, y = e.clientY;

        if (document.documentElement.clientWidth < x + offset) {
            x = document.documentElement.clientWidth - offset;
        }
        
        return { x, y };
    }, []);

    return getPosition;
}

export default useGetPosition;