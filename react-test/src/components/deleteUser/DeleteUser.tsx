import styles from './DeleteUser.module.css'

interface DeleteUserProps {
    handleYes: () => void;
    handleNo: () => void;
}

const DeleteUser = ({handleYes,handleNo} : DeleteUserProps) => {
    
    return(
        <div className={styles.backdrop}>
        <div className={styles.container}>
          <div className={styles.title}>
            <span>Alert</span>
            <span className={styles.exit} onClick={handleNo}>X</span>
          </div>
          <div className={styles.description}>
            <p>Are you sure you want to delete this user ?</p>
          </div>
          <div className={styles.buttons}>
            <button className={`${styles.button} ${styles['yes-button']}`} onClick={handleYes}>Yes</button>
            <button className={`${styles.button} ${styles['no-button']}`} onClick={handleNo}>No</button>
          </div>
        </div>
      </div>
    )
}

export default DeleteUser