import React, { FormEvent, useRef, useState } from "react";
import style from "./AddUser.module.css";
import { User } from "../../User";

interface Props {
  emit: (user: User) => void;
}

const AddUser: React.FC<Props> = ({ emit }) => {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const birthdateRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

  const [firstnameError, setFirstNameError] = useState<boolean>(false);
  const [lastnameError, setLastnameError] = useState<boolean>(false);
  const [birthdateError, setBirthdateError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

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
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(emailRef.current!.value)) {
      setEmailError(true)
    }
  }

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
    const user: User = { firstName, lastName, birthDate,email, gender };
    emit(user);
  };

  return (
    <div className={style["form-container"]}>
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <label>First name:</label>
        <input
          ref={firstNameRef}
          onFocus={() => {
            setFirstNameError(false);
          }}
          onBlur={checkFirstname}
          className={`${firstnameError ? style["error-input"] : ""}`}
        />
        {firstnameError && <span>Please enter a valid first name</span>}
        <label>Last name:</label>
        <input
          ref={lastNameRef}
          onFocus={() => {
            setLastnameError(false);
          }}
          onBlur={checkLastname}
          className={`${lastnameError ? style["error-input"] : ""}`}
        />
        {lastnameError && <span>Please enter a valid last name</span>}
        <label>Birthdate:</label>
        <input
          ref={birthdateRef}
          onFocus={() => {
            setBirthdateError(false);
          }}
          onBlur={checkBirthdate}
          type="date"
          className={`${birthdateError ? style["error-input"] : ""}`}
        />
        {birthdateError && <span>Please enter a valid birthdate</span>}
        <label>Email:</label>
        <input
          ref={emailRef}
          onFocus={() => {
            setEmailError(false);
          }}
          onBlur={checkEmail}
          className={`${emailError ? style["error-input"] : ""}`}
        />
        {emailError && <span>Please enter a valid email</span>}
        <label>Gender:</label>
        <select ref={genderRef}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="NONE">None</option>
        </select>
        <button className={style.button}>Submit</button>
      </form>
    </div>
  );
};

export default AddUser;
