import style from './Toaster.module.css'

const Toaster : React.FC<{
    class: string;
    show: boolean;
    title: string;
    message:string;
    hideModal: () => void;}> = props => {
    return (
        <div className={`${style.container} ${style[props.class]} ${props.show ? style.show : ''}`}>
            <div className={style.title}>
                <span>{props.title}</span>
                <span className={style.exit} onClick={props.hideModal}>X</span>
            </div>
            <div className={style.body}>
                <span>{props.message}</span>
            </div>
        </div>
    )
}

export default Toaster;