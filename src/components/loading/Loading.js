import styles from "./loading.module.css";
import Image from "next/image";

const Loading = () => {
    const chooseTynkovich = () => {
        const rnd = Math.floor(Math.random() * 10);

        if (rnd < 4) return 1;
        if (rnd < 7) return 2;
        return 3;
    }

    const tynkovich = chooseTynkovich();

    return (
        <div className={styles.loading}>
            <Image src={`/sticker${tynkovich}.webp`} priority={true} alt="Tynkovich vertitsya" width={200} height={200} className={styles.image}/>
        </div>
    );
}

export default Loading;