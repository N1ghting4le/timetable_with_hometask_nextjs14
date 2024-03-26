import styles from "./modalCloser.module.css";

const ModalCloser = ({ onClick }) => <div className={styles.closeModal} onClick={onClick}/>;

export default ModalCloser;