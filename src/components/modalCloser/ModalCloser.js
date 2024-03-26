import styles from "./modalCloser.module.css";

const ModalCloser = ({ onClick }) => (
    <div className={styles.wrapper}>
        <div className={styles.closeModal} onClick={onClick}/>
    </div>
);

export default ModalCloser;