import { API_URL } from "./api.js";

export async function getAllMessages() {
    const response = await fetch(API_URL + "/messages", {
        method: "GET",
    });

    const getMessagesResponse = await response.json();
    console.log("getMessagesResponse:", getMessagesResponse);

    return getMessagesResponse;
}

export async function createMessage(message) {
    const response = await fetch(API_URL + "/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });

    const postCreateMessageResponse = await response.json();

    return postCreateMessageResponse;
}

export async function deleteMessage(messageId) {
    const response = await fetch(
        API_URL + "/messages/" + messageId,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )
    const deleteMessageResponse = await response.json()
    return deleteMessageResponse
}
