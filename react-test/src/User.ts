export interface User {
    id?: string;
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: string;
};

export interface UserProptype {
    users: User[];
    add:boolean;
    handleAdd: () => void;
    handleDisableAdd: () => void;
};