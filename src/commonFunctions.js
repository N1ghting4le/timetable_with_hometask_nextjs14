import Btn from "./components/Btn/Btn";

export const renderElements = (id, className, func, process, errorClName, cond = null) => {
    if (cond) return null;

    return (
        <>
            <textarea id={id} type="text" className={className} onKeyDown={(e) => e.code === 'Enter' ? func() : null}/>
            {
                process === 'sending' ? <p>Отправка...</p> :
                <>
                    <Btn onClick={func}>Подтвердить</Btn>
                    {
                        process === 'error' ? <p className={errorClName}>Произошла ошибка (разрабы дауны)</p> : null
                    }
                </>
            }
        </>
    );
}