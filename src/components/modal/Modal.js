'use client';

import { useEffect } from "react";
import Popup from "reactjs-popup";
import "./modal.css";

const Modal = ({ open, onClose, style, className, align, process, children }) => {
    useEffect(() => {
        document.scrollingElement.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    const margin = (() => {
        switch (align) {
            case 'left top': return '0';
            case 'center top': return '0 auto';
            case 'right top': return '0 0 0 auto';
            case 'left center': return 'auto 0 auto 0';
            case 'center center': return 'auto';
            case 'right center': return 'auto 0 auto auto';
            case 'left bottom': return 'auto 0 0 0';
            case 'center bottom': return 'auto auto 0 auto';
            case 'right bottom': return 'auto 0 0 auto';
            default: return 'auto';
        }
    })();

    return (
        <Popup 
            modal open={open} onClose={onClose} contentStyle={{margin, ...style}} 
            closeOnDocumentClick={process !== 'pending'}>
            <div className={`popup_content_wrapper ${className}`}>
                <div className="modal_closer_wrapper">
                    <div className="modal_closer" onClick={onClose}>&times;</div>
                </div>
                {children}
            </div>
        </Popup>
    );
}

export default Modal;