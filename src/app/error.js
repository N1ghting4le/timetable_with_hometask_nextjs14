'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from "./error.module.css";
 
export default function Error({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className={styles.error}>
      <Image src="/Arthas.jpg" alt='Papich rage' width={912} height={513}/>
      <h1>Папич сошёл с ума и положил интернет!</h1>
      <h2>Чтобы попробовать восстановить равновесие силы перезагрузите страницу</h2>
      <Link href='/'>Вернуться на главную</Link>
    </div>
  );
}