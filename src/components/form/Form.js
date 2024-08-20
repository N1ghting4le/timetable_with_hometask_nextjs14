import QueryStateDisplay from "../queryStateDisplay/QueryStateDisplay";
import styles from "./form.module.css";

const Form = ({ id, className, onSubmit, process, cond, text }) => cond ? null : (
    <>
        <textarea id={id} type="text" autoFocus={true} defaultValue={text} 
                    className={`${styles.input} ${className}`}/>
        { process !== 'pending' ? 
            <button className={styles.button} onClick={onSubmit}>Подтвердить</button> : null }
        <QueryStateDisplay queryState={process}/>
    </>
);

export default Form;