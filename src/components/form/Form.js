import Btn from "../btn/Btn";
import styles from "./form.module.css";

const Form = ({id, className, onSubmit, process, cond, text}) => cond ? null : (
    <>
        <textarea id={id} type="text" autoFocus={true} defaultValue={text || ''} 
                    className={className ? `${styles.input} ${className}` : styles.input}/>
        {
            process === 'pending' ? <p>Отправка...</p> :
            <>
                <Btn onClick={onSubmit}>Подтвердить</Btn>
                {
                    process === 'error' ? <p className={styles.error}>Произошла ошибка (разрабы дауны)</p> : null
                }
            </>
        }
    </>
);

export default Form;