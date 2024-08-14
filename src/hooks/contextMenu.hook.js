import { useState, useCallback } from "react";

const useContextMenu = (width) => {
    const [isActive, setIsActive] = useState(false);
    const [isOverlay, setIsOverlay] = useState(false);
    const [coords, setCoords] = useState({});

    const triggerContextMenu = useCallback((e) => {
        e.preventDefault();

        const { x, y } = getPosition(e, width);

        setIsActive(true);
        setIsOverlay(true);
        setCoords({ left: `${x}px`, top: `${y}px` });
    }, []);

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

    return { triggerContextMenu, isActive, setIsActive, isOverlay, setIsOverlay, coords, width };
}

export default useContextMenu;