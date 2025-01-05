import { User } from "../User";


const url = 'http://localhost:8080/api/users/';


export const getAllUsers = async(): Promise<User[]> => {
    const response = await fetch(url);
    return await response.json()
}

export const addUser = async(user: User): Promise<User> => {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message)
    }
    return data;
}

export const getUserById = async(id: number) : Promise<User> => {
    const response = await fetch(`${url}/${id}`);
    return await response.json()
}