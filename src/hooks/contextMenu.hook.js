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
        if (!e) e = window.MouseEvent;

        let x = e.clientX, y = e.clientY;

        if (document.documentElement.clientWidth < x + offset) {
            x = document.documentElement.clientWidth - offset;
        }
        
        return { x, y };
    }, []);

    return { triggerContextMenu, isActive, setIsActive, isOverlay, setIsOverlay, coords, width };
}

export default useContextMenu;