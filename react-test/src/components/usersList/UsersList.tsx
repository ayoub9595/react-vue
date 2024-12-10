import { UserProptype } from "../../User";
import style from "./UsersList.module.css";

const UsersList: React.FC<UserProptype> = props => {
  return (
    <>
      <div className={style["list-container"]}>
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
            {props.users.map((user,index) => (
              <tr key={index}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.birthdate}</td>
                <td>{user.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UsersList;
