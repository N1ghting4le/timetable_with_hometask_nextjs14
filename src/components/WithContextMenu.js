'use client';

import { useState, useContext, createContext } from "react";
import useGetPosition from "@/hooks/getPosition.hook";

const Context = createContext();

const WithContextMenu = (WrappedComponent, { width }) => (props) => {
    const [isActive, setIsActive] = useState(false);
    const [isOverlay, setIsOverlay] = useState(false);
    const [coords, setCoords] = useState(null);
    const getPosition = useGetPosition();
    const id = "context_menu";

    const triggerContextMenu = (e) => {
        e.preventDefault();

        const { x, y } = getPosition(e, width);

        setIsActive(true);
        setIsOverlay(true);
        setCoords({ left: `${x}px`, top: `${y}px` });
    }

    const closeMenu = () => {
        setTimeout(() => setIsActive(false), 200);
        setIsOverlay(false);
        document.getElementById(id).style.opacity = 0;
    }

    return (
        <Context.Provider value={{ isActive, isOverlay, width, coords, id, closeMenu }}>
            <WrappedComponent {...props} triggerContextMenu={triggerContextMenu}/>
        </Context.Provider>
    );
}

export default WithContextMenu;

export const useContextMenu = () => useContext(Context);