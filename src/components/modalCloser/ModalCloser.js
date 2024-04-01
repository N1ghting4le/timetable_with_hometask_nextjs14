import styles from "./modalCloser.module.css";

const ModalCloser = ({ onClick }) => (
    <div className={styles.wrapper}>
        <div className={styles.closeModal} onClick={onClick}>&times;</div>
    </div>
);

export default ModalCloser;