import { API_URL } from "./api";

export async function login(email, password) {
    const response = await fetch(
        API_URL + "/users/login",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject
}

export async function deleteUser(userId) {
    const response = await fetch(
        API_URL + "/users/" + userId,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const deleteUserResponse = await response.json()

    return deleteUserResponse
}

export async function logout(authenticationKey) {
    const response = await fetch(
        API_URL + "/users/logout",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                authenticationKey
            })
        }
    )

    const APIResponseObject = response.json()

    return APIResponseObject
}


export async function getAllUsers() {
    // GET from the API /users
    const response = await fetch(
        API_URL + "/users",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.users
}

export async function getUserByID(userID) {
    const response = await fetch(
        API_URL + "/users/" + userID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.user
}

export async function updateUser(user) {
    const response = await fetch(
        API_URL + "/users",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(user)
        }
    )

    const patchUserResult = await response.json()

    return patchUserResult
}

export async function createUser(user) {
    const response = await fetch(
        API_URL + "/users/register",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(user)
        }
    )

    const patchUserResult = await response.json()

    return patchUserResult
}

export async function getByAuthenticationKey(authenticationKey) {
    const response = await fetch(
        API_URL + "/users/by-key/" + authenticationKey,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.user
}