import styles from "./loading.module.css";

const Loading = () => (
    <div className={styles.clock}>
        <div className={styles.top}></div>
        <div className={styles.right}></div>
        <div className={styles.bottom}></div>
        <div className={styles.left}></div>
        <div className={styles.center}></div>
        <div className={styles.shadow}></div>
        <div className={styles.hour}></div>
        <div className={styles.minute}></div>
        <div className={styles.second}></div>
    </div>
);

export default Loading;