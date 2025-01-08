import { useContextMenu } from '../WithContextMenu';
import styles from './contextMenu.module.css';

const ContextMenu = ({ children }) => {
    const { isActive, isOverlay, width, coords, id, closeMenu } = useContextMenu();

    return (
        <>
            {isOverlay && <div className={styles.overlay} onClick={closeMenu}/>}
            {isActive &&
            <div className={styles.conetxtMenu} id={id} style={{...coords, width: `${width}px`}} onClick={closeMenu}>
                { children }
            </div>}
        </>
    );
}

export default ContextMenu;