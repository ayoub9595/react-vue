import { useEffect, useState } from "react";
import style from "./App.module.css";
import UsersList from "./components/usersList/UsersList";
import AddUser from "./components/addUser/AddUser";
import { User } from "./User";
import { addUser, getAllUsers, transformFirebaseResponse } from "./service/userService";
import BackDrop from "./components/backdrop/BackDrop";
import { FirebaseAddResponse } from "./service/FirebaseResponse";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading,setLoading] = useState(false)

  const addNewUser = async(user:User) => {
    try {
        const data = await addUser(user) as FirebaseAddResponse;
        setUsers([...users,{...user,id: data.name}])
        alert('User created succesfully')
    }
    catch(error){
        console.log(error)
    }
}

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let usersList = await getAllUsers();
      usersList = transformFirebaseResponse(usersList);
      setUsers(usersList);
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers()
  }, []);

  return (
    <div className={style.container}>
      {loading && <BackDrop />}
      <AddUser emit={addNewUser} />
      <UsersList users={users} />
    </div>
  );
};

export default App;
