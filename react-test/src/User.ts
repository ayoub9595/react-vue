export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    gender: string;
    role: string;
};

export interface UserInfo {
    isAdmin: boolean;
    userId: number;
    email: string;
}

export interface UserProptype {
    users: User[];
    add:boolean;
    handleAdd: () => void;
    handleDisableAdd: () => void;
    handleEditClick: (id:string|undefined) => void;
    handleDeleteClick: (id:string|undefined) => void;
    userInfo: UserInfo;
};