import styles from "./btn.module.css";

const Btn = ({ onClick, children, className }) => (
    <button className={className || styles.button} onClick={onClick}>{children}</button>
);

export default Btn;