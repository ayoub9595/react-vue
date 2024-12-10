import type { FirebaseGetResponse } from "@/FirebaseRepsonse";
import type { User } from "@/User";

const url = 'https://db-data-81e13-default-rtdb.europe-west1.firebasedatabase.app/users.json'

export const transformFirebaseResponse = (response: FirebaseGetResponse): User[] => {
    return Object.entries(response).map(([key, value]) => ({
      ...value,
      id: key
    }))
  }

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
    return await response.json()
}