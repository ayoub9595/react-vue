import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import style from './BackDrop.module.css'

const BackDrop = () => {
    return (
    <div className={style.backdrop}>
        <LoadingSpinner />
    </div>
    )
}

export default BackDrop;