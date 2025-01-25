import { FormEvent, useRef, useState, useEffect } from "react";
import styles from "./Login.module.css";
import { authenticate } from "../../service/authenticationService";
import Toaster from "../../components/toaster/Toaster";
import { setAuthTokens } from "../../utils/authUtils";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [modal, setModal] = useState({
        show: false,
        class: "",
        title: "",
        message: "",
    });

    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const isEmailValid = emailRegex.test(emailRef.current!.value);
            const isPasswordValid = passwordRef.current?.value !== "";
            setEmailError(!isEmailValid);
            setPasswordError(!isPasswordValid);
            if (!isEmailValid || !isPasswordValid) {
                return;
            }

            const email = emailRef.current!.value;
            const password = passwordRef.current!.value;
            const response = await authenticate({ email, password });
            setAuthTokens(response);
            onLoginSuccess();
        } catch (error) {
            const message = (error instanceof Error && error.message !== 'Unexpected end of JSON input') 
                ? error.message 
                : 'Email or password is not correct';
            
            setModal({
                show: true,
                class: "danger",
                title: "Error",
                message
            });
        }
    };

    const checkEmail = () => {
        if (!emailRegex.test(emailRef.current!.value)) {
            setEmailError(true);
        }
    };

    const checkPassword = () => {
        if (passwordRef.current?.value === "") {
            setPasswordError(true);
        }
    };

    useEffect(() => {
        if (modal.show) {
            setTimeout(() => {
                setModal((prev) => ({ ...prev, show: false }));
            }, 5000);
        }
    }, [modal]);

    return (
        <div className={styles.parent}>
            <Toaster
                show={modal.show}
                class={modal.class}
                title={modal.title}
                message={modal.message}
                hideModal={() => setModal((prev) => ({ ...prev, show: false }))}
            />
            <div className={styles.container}>
                <h1>Login</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        ref={emailRef}
                        className={`${styles.input} ${emailError ? styles["error-input"] : ""}`}
                        onBlur={checkEmail}
                        onFocus={() => setEmailError(false)}
                    />
                    {emailError && <span>Email is not valid</span>}
                    <label>Password:</label>
                    <input
                        ref={passwordRef}
                        type="password"
                        className={`${styles.input} ${passwordError ? styles["error-input"] : ""}`}
                        onBlur={checkPassword}
                        onFocus={() => setPasswordError(false)}
                    />
                    {passwordError && <span>Password cannot be empty</span>}
                    <button className={styles.button}>Connect</button>
                </form>
            </div>
        </div>
    );
};

export default Login;