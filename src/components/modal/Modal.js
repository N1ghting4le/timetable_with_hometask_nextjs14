'use client';

import Popup from "reactjs-popup";
import ModalCloser from "../modalCloser/ModalCloser";
import "./popup.css";

const Modal = ({ open, onClose, style, children }) => {
    return (
        <Popup modal open={open} onClose={onClose} contentStyle={style}>
            <ModalCloser onClick={onClose}/>
            {children}
        </Popup>
    );
}

export default Modal;