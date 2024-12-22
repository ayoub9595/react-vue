import { useEffect, useState } from "react";
import style from "./App.module.css";
import UsersList from "./components/usersList/UsersList";
import AddUser from "./components/addUser/AddUser";
import { User } from "./User";
import { addUser, getAllUsers, transformFirebaseResponse } from "./service/userService";
import BackDrop from "./components/backdrop/BackDrop";
import { FirebaseAddResponse } from "./service/FirebaseResponse";
import Toaster from "./components/toaster/Toaster";
import { handleApiError, logError } from "./utils/ErrorHandler";

const App = () => {
  const [showAddUser,setShowAddUser] = useState(false);
  const [add,setAdd] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    class: '',
    title: '',
    message: '',
  });

  const addNewUser = async (user: User) => {
    try {
      const data = await addUser(user) as FirebaseAddResponse;
      setUsers([...users, { ...user, id: data.name }]);
      
      setModal({
        show: true,
        class: 'success',
        title: 'Success',
        message: 'User created successfully'
      });
    } catch (error) {
      logError(error, 'addNewUser');
      const errorResponse = handleApiError(error);
      setModal({
        show: true,
        ...errorResponse
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersList = await getAllUsers();
      const transformedUsers = transformFirebaseResponse(usersList);
      setUsers(transformedUsers);
    } catch (error) {
      logError(error, 'fetchUsers');
      const errorResponse = handleApiError(error);
      setModal({
        show: true,
        ...errorResponse
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const hideModal = () => setModal(prev => ({ ...prev, show: false }));

  useEffect(() => {
    if(modal.show) {
      setTimeout(() => {
        setModal(prev => ({...prev,show: false}))
      },5000)
    }
  },[modal])

  return (
    <div className={style.container}>
      {loading && <BackDrop />}
      {showAddUser && <AddUser emit={addNewUser} />}
      <UsersList add={add}
                 handleAdd={() => {setAdd(false);setShowAddUser(true)}}
                 handleDisableAdd={() => {setAdd(true);setShowAddUser(false)}}
                 users={users} />
      <Toaster
        show={modal.show}
        class={modal.class}
        title={modal.title}
        message={modal.message}
        hideModal={hideModal}
      />
    </div>
  );
};

export default App;