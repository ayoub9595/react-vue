import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./EditUser.module.css";
import { User } from "../../User";
import { getUserById } from "../../service/userService";

const EditUser = ({
  id,
  handleClose,
  emit,
}: {
  id: string;
  handleClose: () => void;
  emit: (user: User) => void;
}) => {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const birthdateRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

  const [firstnameError, setFirstNameError] = useState<boolean>(false);
  const [lastnameError, setLastnameError] = useState<boolean>(false);
  const [birthdateError, setBirthdateError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  const handleClickExit = () => {
    handleClose();
  };

  const checkFirstname = () => {
    if (firstNameRef.current!.value === "") {
      setFirstNameError(true);
    }
  };
  const checkLastname = () => {
    if (lastNameRef.current!.value === "") {
      setLastnameError(true);
    }
  };
  const checkBirthdate = () => {
    if (birthdateRef.current!.value === "") {
      setBirthdateError(true);
    }
  };
  const checkEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailRef.current!.value)) {
      setEmailError(true);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFirstNameEmpty = !firstNameRef.current?.value;
    const isLastNameEmpty = !lastNameRef.current?.value;
    const isBirthdateEmpty = !birthdateRef.current?.value;

    setFirstNameError(isFirstNameEmpty);
    setLastnameError(isLastNameEmpty);
    setBirthdateError(isBirthdateEmpty);

    if (isFirstNameEmpty || isLastNameEmpty || isBirthdateEmpty) {
      return;
    }

    const firstName = firstNameRef.current!.value;
    const lastName = lastNameRef.current!.value;
    const birthDate = birthdateRef.current!.value;
    const email = emailRef.current!.value;
    const gender = genderRef.current!.value;
    const user: User = { firstName, lastName, birthDate, email, gender, role: 'ROLE_USER'};
    emit({ id, ...user });
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const fetchedUser = await getUserById(parseInt(id));
        const { firstName, lastName, birthDate, email, gender } = fetchedUser;
        firstNameRef.current!.value = firstName;
        lastNameRef.current!.value = lastName;
        birthdateRef.current!.value = birthDate;
        emailRef.current!.value = email;
        genderRef.current!.value = gender;
      } catch (error) {
        console.error(error);
      }
    };
    loadUser();
  }, [id]);
  return (
    <>
      <div className={styles.backdrop}>
        <div className={styles["form-container"]}>
          <div className={styles.header}>
            <h1 className={styles.title}>Edit User</h1>
            <div className={styles.exit} onClick={handleClickExit}>
              X
            </div>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles["form-inputs"]}>
              <div className={styles["form-group"]}>
                <label>First name:</label>
                <input
                  ref={firstNameRef}
                  onFocus={() => {
                    setFirstNameError(false);
                  }}
                  onBlur={checkFirstname}
                  className={`${styles.input} ${firstnameError ? styles["error-input"] : ""}`}
                />
                {firstnameError && <span>Please enter a valid first name</span>}
              </div>
              <div className={styles["form-group"]}>
                <label>Last name:</label>
                <input
                  ref={lastNameRef}
                  onFocus={() => {
                    setLastnameError(false);
                  }}
                  onBlur={checkLastname}
                  className={`${styles.input} ${lastnameError ? styles["error-input"] : ""}`}
                />
                {lastnameError && <span>Please enter a valid last name</span>}
              </div>
              <div className={styles["form-group"]}>
                <label>Birthdate:</label>
                <input
                  ref={birthdateRef}
                  onFocus={() => {
                    setBirthdateError(false);
                  }}
                  onBlur={checkBirthdate}
                  type="date"
                  className={`${styles.input} ${birthdateError ? styles["error-input"] : ""}`}
                />
                {birthdateError && <span>Please enter a valid birthdate</span>}
              </div>
              <div className={styles["form-group"]}>
                <label>Email:</label>
                <input
                  ref={emailRef}
                  onFocus={() => {
                    setEmailError(false);
                  }}
                  onBlur={checkEmail}
                  className={`${styles.input} ${emailError ? styles["error-input"] : ""}`}
                />
                {emailError && <span>Please enter a valid email</span>}
              </div>
              <div id="select-div" className={styles["form-group"]}>
                <label>Gender:</label>
                <select className={styles.select} ref={genderRef}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </div>
            <div className={styles["form-group"]}>
              <button className={styles.button}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUser;
