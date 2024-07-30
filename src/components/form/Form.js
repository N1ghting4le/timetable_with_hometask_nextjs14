import styles from "./form.module.css";

const Form = ({id, className, onSubmit, process, cond, text}) => cond ? null : (
    <>
        <textarea id={id} type="text" autoFocus={true} defaultValue={text || ''} 
                    className={`${styles.input} ${className || ''}`}/>
        {
            process === 'pending' ? <p>Отправка...</p> :
            <>
                <button className={styles.button} onClick={onSubmit}>Подтвердить</button>
                {
                    process === 'error' ? <p className={styles.error}>Произошла ошибка (разрабы дауны)</p> : null
                }
            </>
        }
    </>
);

export default Form;