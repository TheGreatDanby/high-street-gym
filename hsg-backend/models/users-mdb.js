import { ObjectId } from "mongodb"
import { User } from "./users.js"
import { db } from "../database/mongodb.js"

export async function getAll() {
    // Get the collection of all users
    const allUserResults = await db.collection("users").find().toArray()
    // Convert the collection of results into a list of User objects
    return await allUserResults.map(userResult =>
        User(
            userResult._id.toString(),
            userResult.email,
            userResult.password,
            userResult.role,
            userResult.firstName,
            userResult.lastName,
            userResult.authenticationKey,
        )
    )
}

export async function getByID(userID) {
    // Get one matching user
    let userResult = await db.collection("users")
        .findOne({ _id: new ObjectId(userID) })

    // Convert the result into a User object
    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                userResult.authenticationKey,
            )
        )
    } else {
        return Promise.reject("no user found")
    }
}

export async function getByEmail(email) {
    // Get one matching user
    let userResult = await db.collection("users").findOne({ email })

    // Convert the result into a User object
    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                userResult.authenticationKey,
            )
        )
    } else {
        return Promise.reject("no user found")
    }
}

export async function getByAuthenticationKey(authenticationKey) {
    // Get one matching user
    let userResult = await db.collection("users")
        .findOne({ authenticationKey })

    // Convert the result into a User object
    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                userResult.authenticationKey,
            )
        )
    } else {
        return Promise.reject("no user found")
    }
}

export async function create(user) {
    // New user should not have existing IDs, delete just to be sure.
    delete user.id
    // Insert user object and return
    return db.collection("users").insertOne(user).then(result => {
        delete user._id
        return { ...user, id: result.insertedId.toString() }
    })
}

export async function update(user) {
    // Convert ID into a mongoDB objectId and remove from object
    const userID = new ObjectId(user.id)
    delete user.id
    // Create the update document
    const userUpdateDocument = {
        "$set": user
    }
    // Run the update query and return the resulting promise
    return db.collection("users").updateOne({ _id: userID }, userUpdateDocument)
}
export async function updateUserXML(user) {
    const userEmail = user.email;

    const userUpdateDocument = {
        "$set": user
    }
    return db.collection("users").updateOne({ email: userEmail }, userUpdateDocument)
}

export async function createUserXML(user) {
    // delete classes.id

    let result = await db.collection("users").insertOne({ ...user })

    // Rebuild the trail object with the inserted ID
    return Promise.resolve({ ...result, id: result.insertedId.toString() })
}

export async function deleteByID(userID) {
    return db.collection("users").deleteOne({ _id: new ObjectId(userID) })
}