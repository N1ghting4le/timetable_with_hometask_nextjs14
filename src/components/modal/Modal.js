'use client';

import { useEffect } from "react";
import Popup from "reactjs-popup";
import ModalCloser from "../modalCloser/ModalCloser";
import "./popup.css";

const Modal = ({ open, onClose, style, animated, children }) => {
    useEffect(() => {
        document.documentElement.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    return (
        <Popup modal open={open} onClose={onClose} contentStyle={style} className={animated ? 'animated' : ''}>
            <ModalCloser onClick={onClose}/>
            {children}
        </Popup>
    );
}

export default Modal;