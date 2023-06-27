import styles from "./QrCodeGrid.module.css";

// eslint-disable-next-line react/prop-types
const QrCodeGrid = ({ onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.rows}>
        <div className={`${styles.cells} ${styles.topLeft}`}></div>
        <div className={styles.cells}></div>
        <div className={`${styles.cells} ${styles.topRight}`}></div>
      </div>
      <div className={styles.rows}>
        <div className={styles.cells}></div>
        <div className={styles.cells}></div>
        <div className={styles.cells}></div>
      </div>
      <div className={styles.rows}>
        <div className={`${styles.cells} ${styles.bottomLeft}`}></div>
        <div className={styles.cells}></div>
        <div className={`${styles.cells} ${styles.bottomRight}`}></div>
      </div>
    </div>
  );
};

export default QrCodeGrid;