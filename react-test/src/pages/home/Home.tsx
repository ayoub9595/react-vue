import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Home.module.css";
import UsersList from "../../components/usersList/UsersList";
import AddUser from "../../components/addUser/AddUser";
import { User, UserInfo } from "../../User";
import { addUser, deleteUserById, getUsers, updateUser } from "../../service/userService";
import BackDrop from "../../components/backdrop/BackDrop";
import Toaster from "../../components/toaster/Toaster";
import EditUser from "../../components/editUser/EditUser";
import DeleteUser from "../../components/deleteUser/DeleteUser";
import LogoutIcon from "../../components/icons/LogoutIcon";
import { clearAuthTokens } from "../../utils/authUtils";
import { getCurrentUserInfo } from "../../utils/tokenUtils";
interface HomeProps {
  setIsAuthenticated: (value: boolean) => void;
}


const Home: React.FC<HomeProps> = ({setIsAuthenticated}) => {
  const navigate = useNavigate();
  const [showAddUser, setShowAddUser] = useState(false);
  const [add, setAdd] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userIdToEdit, setUserIdToEdit] = useState(0);
  const [showEditUser, setShowEditUser] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(0);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    class: '',
    title: '',
    message: '',
  });
  const [logoutColor,setLogoutColor] = useState('#FFF');
  const [userInfo, setUserInfo] = useState<UserInfo| null >(null);



  const addNewUser = async (user: User) => {
    try {
      const addedUser = await addUser(user);
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
      const updatedUser = await updateUser(user);
      const index = users.findIndex(u => (u.id === updatedUser.id));
      setUsers(prev => {
        const newUsers = [...prev];
        newUsers[index] = updatedUser;
        return newUsers;
      });
      setShowEditUser(false);
      setModal({
        show: true,
        class: 'success',
        title: 'Success',
        message: 'User modified successfully',
      });
    } catch (error) {
      setModal({
        show: true,
        class: 'danger',
        title: 'Error',
        message: error as string,
      });
    }
  };

  const handleEditClick = (strId: string|undefined) => {
    const id = strId ? parseInt(strId) : 0;
    setUserIdToEdit(id);
    setShowEditUser(true);
  };

  const handleDeleteClick = (strId: string|undefined) => {
    const id = strId ? parseInt(strId) : 0;
    setUserIdToDelete(id);
    setShowDeleteUser(true);
  };

  const deleteUser = async() => {
    try {
      await deleteUserById(userIdToDelete);
      const index = users.findIndex(
        user => user.id === userIdToDelete.toString(),
      );
      const newUsers = [...users];
      newUsers.splice(index, 1);
      setUsers(newUsers);
      setModal({
        show: true,
        class: 'success',
        title: 'Success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      setModal({
        show: true,
        class: 'danger',
        title: 'Error',
        message: error as string,
      });
    } finally {
      setShowDeleteUser(false);
    }
  };

  const hideDelete = () => {
    setShowDeleteUser(false);
  };

  const handleLogoutClick = () => {
    clearAuthTokens();
    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    try {
      const info = getCurrentUserInfo();
      setUserInfo(info);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      navigate('/');
    }
  }, [navigate]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersList = await getUsers();
        setUsers(usersList);
      } catch (error) {
        setModal({
          show: true,
          class: 'danger',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Error to fetch users'
        });
        if (error instanceof Error && error.message.includes('Invalid token')) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers()
  }, [navigate]);

  const hideModal = () => setModal(prev => ({ ...prev, show: false }));

  useEffect(() => {
    if(modal.show) {
      setTimeout(() => {
        setModal(prev => ({...prev, show: false}));
      }, 5000);
    }
  }, [modal]);

  return (
    <div className={style.container}>
      {loading && <BackDrop />}
      {showAddUser && <AddUser emit={addNewUser} />}
      <button className={style['logout-button']} 
              onMouseLeave={() => setLogoutColor('#FFF')}
              onMouseEnter={() => setLogoutColor('#000')}
              onClick={handleLogoutClick}>
        <LogoutIcon height="40px" width="40px" color={logoutColor} />
      </button>
      <UsersList 
        add={add}
        handleAdd={() => {setAdd(false);setShowAddUser(true)}}
        handleDisableAdd={() => {setAdd(true);setShowAddUser(false)}}
        users={users}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        userInfo={userInfo!}  // Pass userInfo as prop
      />
      <Toaster
        show={modal.show}
        class={modal.class}
        title={modal.title}
        message={modal.message}
        hideModal={hideModal}
      />
      {showEditUser && 
        <EditUser 
          id={userIdToEdit.toString()}
          handleClose={() => setShowEditUser(false)}
          emit={updateExistingUser}
        />
      }
      {showDeleteUser && 
        <DeleteUser 
          handleYes={deleteUser} 
          handleNo={hideDelete} 
        />
      }
    </div>
  );
};

export default Home;