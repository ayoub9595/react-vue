import { useEffect, useState } from "react";
import { UserProptype } from "../../User";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import style from "./UsersList.module.css";

const UsersList: React.FC<UserProptype> = (props) => {

  const [editColor,setEditColor] = useState<string[]>([])
  const [deleteColor,setDeleteColor] = useState<string[]>([])

  useEffect(() => {
    if (props.users) {
      setEditColor(new Array(props.users.length).fill('#000000'))
      setDeleteColor(new Array(props.users.length).fill('#000000'))
    }
  }, [props.users])

  const changeEditColor = (index: number,color: string) => {
    setEditColor(prev => {
      const newArray = [...prev];
      newArray[index] = color;
      return newArray;
    })
  }

  const changeDeleteColor = (index: number,color: string) => {
    setDeleteColor(prev => {
      const newArray = [...prev];
      newArray[index] = color;
      return newArray;
    })
  }
  
  const handleClick = () => {
    if(props.add) {
      props.handleAdd()
    }else {
      props.handleDisableAdd()
    } 
  }
  return (
    <>
      <div className={style["list-container"]}>
        {props.users.length === 0 ? (
          <h1>No users exists please add one</h1>
        ) : (
          <>
            <button className={style['add-button']} 
                    onClick={handleClick}>{props.add ?'+': 'x'}</button>
            <h1>User List</h1>
            <table className={style["styled-table"]}>
              <thead>
                <tr>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Birthdate</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>...</th>
                </tr>
              </thead>
              <tbody>
                {props.users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.birthDate}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>
                      <EditIcon className={style.button}
                                color={editColor[index]}
                                height="30px" 
                                width="30px"
                                onMouseEnter={() => changeEditColor(index,'#FFFFFF')}
                                onMouseLeave={() => changeEditColor(index,'#000000')} />
                      <DeleteIcon className={style.button}
                                  color={deleteColor[index]}  
                                  height="30px" 
                                  width="30px"
                                  onMouseEnter={() => changeDeleteColor(index,'#FFFFFF')}
                                  onMouseLeave={() => changeDeleteColor(index,'#000000')} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default UsersList;
