import type { User } from "@/User";

const url = 'http://localhost:8080/api/users/';


export const getAllUsers = async() => {
    const response = await fetch(url);
    return await response.json()
}

export const addUser = async(user: User) => {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(!response.ok) {
        const payload = await response.json()
        console.log(payload)
        throw new Error(payload.message)
    }
    return await response.json()
}

export const getUserById = async(id: number) => {
    const response = await fetch(`${url}${id}`);
    return await response.json()
}

export const updateUser = async(user: User) => {
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(!response.ok) {
        const payload = await response.json()
        console.log(payload)
        throw new Error(payload.message)
    }
    return await response.json()
}

