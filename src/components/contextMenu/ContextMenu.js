import styles from './contextMenu.module.css';

const ContextMenu = ({ children, ...props }) => {
    const { isActive, setIsActive, isOverlay, setIsOverlay, coords, width } = props;
    const id = "context_menu";

    const closeMenu = () => {
        setTimeout(() => setIsActive(false), 200);
        setIsOverlay(false);
        document.getElementById(id).style.opacity = 0;
    }

    return (
        <>
            { isOverlay ? <div className={styles.overlay} onClick={closeMenu}/> : null }
            { isActive ? 
                <div className={styles.conetxtMenu} id={id} style={{...coords, width: `${width}px`}} onClick={closeMenu}>
                    { children }
                </div> : null
            }
        </>
    );
}

export default ContextMenu;