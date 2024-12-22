import { UserProptype } from "../../User";
import style from "./UsersList.module.css";

const UsersList: React.FC<UserProptype> = (props) => {
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
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {props.users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.birthdate}</td>
                    <td>{user.gender}</td>
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
