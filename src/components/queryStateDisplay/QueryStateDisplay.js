import styles from "./queryStateDisplay.module.css";

const QueryStateDisplay = ({ queryState }) => {
    switch (queryState) {
        case 'pending': return <p>Отправка...</p>;
        case 'error': return <p className={styles.error}>Произошла ошибка</p>;
        default: return null;
    }
}

export default QueryStateDisplay;