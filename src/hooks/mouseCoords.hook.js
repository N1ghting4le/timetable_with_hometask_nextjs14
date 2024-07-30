import { useCallback } from "react";

const useMouseCoords = () => {
    const getPosition = useCallback((e, offset = 0) => {
        let x = 0, y = 0;
        
        if (!e) e = window.MouseEvent;
        
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else if (e.clientX || e.clientY) {
            x = e.clientX + document.body.scrollLeft + 
                            document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + 
                            document.documentElement.scrollTop;
        }

        if (document.documentElement.clientWidth < x + offset) {
            x = document.documentElement.clientWidth - offset;
        }
        
        return { x, y };
    }, []);

    return getPosition;
}

export default useMouseCoords;