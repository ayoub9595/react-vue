import { useEffect, useState } from "react";
import style from "./App.module.css";
import UsersList from "./components/usersList/UsersList";
import AddUser from "./components/addUser/AddUser";
import { User } from "./User";
import { addUser, getAllUsers, updateUser } from "./service/userService";
import BackDrop from "./components/backdrop/BackDrop";
import Toaster from "./components/toaster/Toaster";
import EditUser from "./components/editUser/EditUser";

const App = () => {
  const [showAddUser,setShowAddUser] = useState(false);
  const [add,setAdd] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userIdToEdit,setUserIdToEdit] = useState(0);
  const [showEditUser,setShowEditUser] = useState(false)
  const [modal, setModal] = useState({
    show: false,
    class: '',
    title: '',
    message: '',
  });

  const addNewUser = async (user: User) => {
    try {
      const addedUser = await addUser(user)
      setUsers([...users, addedUser]);
      
      setModal({
        show: true,
        class: 'success',
        title: 'Success',
        message: 'User created successfully'
      });
    } catch (error) {
      setModal({
        show: true,
        class: 'danger',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Error to create user'
      });
    }
  };

  const updateExistingUser = async(user: User) => {
    try {
      const updatedUser = await updateUser(user)
      const index = users.findIndex(u => (u.id === updatedUser.id))
      setUsers(prev => {
        const newUsers = [...prev]
        newUsers[index] = updatedUser;
        return newUsers;
      })
      setShowEditUser(false)
      setModal({
        show: true,
        class: 'success',
        title: 'Success',
        message: 'User modified successfully',
      })
    } catch (error) {
      setModal({
        show: true,
        class: 'danger',
        title: 'Erreur',
        message: error as string,
      })
    }
  }

  const handleEditClick = (strId: string|undefined) => {
    const id = strId ? parseInt(strId) : 0;
    setUserIdToEdit(id)
    setShowEditUser(true)
  }

  const handleDeleteClick = (id: string|undefined) => {
    console.log(id);
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (error) {
      setModal({
        show: true,
        class: 'danger',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Error to fetch users'
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
                 users={users}
                 handleEditClick={handleEditClick}
                 handleDeleteClick={handleDeleteClick} />
      <Toaster
        show={modal.show}
        class={modal.class}
        title={modal.title}
        message={modal.message}
        hideModal={hideModal}
      />
      {showEditUser && <EditUser id={userIdToEdit.toString()}
                                 handleClose={() =>setShowEditUser(false)}
                                 emit={updateExistingUser} />}
    </div>
  );
};

export default App;