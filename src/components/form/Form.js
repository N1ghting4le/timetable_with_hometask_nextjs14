'use client';

import { SERVER_URL } from "@/env/env";
import QueryStateDisplay from "../queryStateDisplay/QueryStateDisplay";
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { useRef } from "react";
import styles from "./form.module.css";

const Form = ({ className, onSubmit, process, cond, text, oldFiles, setOldFiles, files, setFiles }) => {
    const ref = useRef();

    const toggleOldFile = (i) => setOldFiles(files =>
        files.map((file, j) => i === j ? ({ ...file, toDelete: !file.toDelete }) : file));

    const uploadFiles = (e) => setFiles(Array.from(e.target.files));
    
    const removeFile = (i) => {
        const dataTransfer = new DataTransfer();
        const restFiles = files.filter((_, j) => i !== j);

        restFiles.forEach(file => dataTransfer.items.add(file));
        ref.current.files = dataTransfer.files;
        setFiles(restFiles);
    }

    const downloadFile = async (fileId, title) => {
        try {
            const response = await fetch(`${SERVER_URL}/download/${fileId}`, { cache: "no-store" });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob(); // Получаем файл как Blob
            const url = window.URL.createObjectURL(blob); // Создаём URL для Blob
            const link = document.createElement('a'); // Создаём временный элемент <a>

            link.href = url;
            link.download = title; // Здесь можно задать имя файла
            document.body.appendChild(link); // Добавляем элемент в DOM
            link.click(); // Инициируем скачивание
            link.remove(); // Удаляем элемент из DOM
            window.URL.revokeObjectURL(url); // Освобождаем память
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    }

    const renderOldFiles = () => oldFiles.map(({ id, title, toDelete }, i) => (
        <li key={id} className={`${styles.fileItem} ${toDelete ? styles.toDelete : null}`}>
            <p className={styles.download} onClick={() => downloadFile(id, title)}>{title}</p>
            {toDelete ?
            <RestoreFromTrashIcon onClick={() => toggleOldFile(i)} style={{ cursor: "pointer" }}/> :
            <DeleteIcon onClick={() => toggleOldFile(i)} style={{ cursor: "pointer" }}/>}
        </li>
    ));
    
    const renderFiles = () => files.map(({ name }, i) => (
        <li key={i} className={styles.fileItem}>
            <p style={{ color: "blue" }}>{name}</p>
            <DeleteIcon onClick={() => removeFile(i)} style={{ cursor: "pointer" }}/>
        </li>
    ));

    const oldFileElems = renderOldFiles();
    const fileElems = renderFiles();

    return cond ? null : (
        <form onSubmit={onSubmit} className={styles.form}>
            <textarea
                type="text"
                autoFocus={true}
                defaultValue={text}
                name="text"
                className={`${styles.input} ${className}`}/>
            <input
                type="file"
                ref={ref}
                name="files"
                multiple
                style={{ display: "none" }}
                onChange={uploadFiles}/>
            <button onClick={() => ref.current.click()} type="button" className={styles.button}>
                Загрузить файлы
            </button>
            {oldFiles.length ?
            <div className={styles.files}>
                <p className={styles.boldAndBig}>Прикреплённые файлы:</p>
                <ul className={styles.filesList}>
                    {oldFileElems}
                </ul>
            </div> : null}
            {files.length ?
            <div className={styles.files}>
                <p className={styles.boldAndBig}>Новые файлы:</p>
                <ul className={styles.filesList}>
                    {fileElems}
                </ul>
            </div> : null}
            {process !== 'pending' &&
            <button type="submit" className={styles.button}>Подтвердить</button>}
            <QueryStateDisplay queryState={process}/>
        </form>
    );
}

export default Form;