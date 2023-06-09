import { Router } from "express";
import bcrypt from "bcryptjs"
import { v4 as uuid4 } from "uuid"
import xml2js from "xml2js"
import auth from "../middleware/auth.js";

// import { validate } from "../middleware/validator.js";
import { User } from "../models/users.js";
import { create, deleteByID, getByAuthenticationKey, getByEmail, getByID, update, getAll, createUserXML, updateUserXML } from "../models/users-mdb.js";


const userController = Router()
// TODO: add validation (watch video: Week 2 - Project Architecture, around 40 min mark)

//// User login endpoint
const postUserLoginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            pattern: "^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$",
            type: "string"
        },
        password: {
            type: "string"
        }
    }
}

userController.post(
    "/users/login",

    // validate({ body: postUserLoginSchema }),
    (req, res) => {
        const loginData = req.body

        getByEmail(loginData.email)
            .then(user => {
                if (bcrypt.compareSync(loginData.password, user.password)) {
                    user.authenticationKey = uuid4().toString()

                    // Store the updated user back into the database
                    update(user).then(result => {
                        // Send the auth key back to the user
                        res.status(200).json({
                            status: 200,
                            message: "user logged in",
                            authenticationKey: user.authenticationKey
                        })
                    })
                } else {
                    // This is the case where the password doesn't match
                    res.status(400).json({
                        status: 400,
                        message: "invalid credentials"
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "login failed"
                })
            })
    }
)

//// User logout endpoint
const postUserLogoutSchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string"
        }
    }
}

userController.post(
    "/users/logout",
    // validate({ body: postUserLogoutSchema }),
    (req, res) => {
        const authenticationKey = req.body.authenticationKey
        getByAuthenticationKey(authenticationKey)
            .then(user => {
                user.authenticationKey = null
                update(user)
                    .then(user => {
                        res.status(200).json({
                            status: 200,
                            message: "user logged out"
                        })
                    })
            }).catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "failed to logout user"
                })
            })

    }
)

//// Get user list endpoint
userController.get(
    "/users",
    // auth(["Admin", "Trainer", "Member"]),
    async (req, res) => {
        /*
        #swagger.parameters['authenticationKey'] = {
            in: 'header', required: true
        }
        */

        const users = await getAll()

        res.status(200).json({
            status: 200,
            message: "user list",
            users: users,
        })
    }
)

//// Get user by ID endpoint
// const getUserByIDSchema = {
//     type: "object",
//     required: ["id"],
//     properties: {
//         id: {
//             type: "string"
//         }
//     }
// }

userController.get(
    "/users/:id",
    // auth(["Admin"]),

    // validate({ params: getUserByIDSchema }),
    (req, res) => {
        const userID = req.params.id

        getByID(userID).then(user => {
            res.status(200).json({
                status: 200,
                message: "Get user by ID",
                user: user,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get user by ID"
            })
        })
    }
)

//// Get user by authentication key endpoint
const getUserByAuthenticationKeySchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string"
        }
    }
}

userController.get(
    "/users/by-key/:authenticationKey",

    // auth(["Admin"]),

    // validate({ params: getUserByAuthenticationKeySchema }),
    (req, res) => {
        const userAuthKey = req.params.authenticationKey
        getByAuthenticationKey(userAuthKey).then(user => {
            res.status(200).json({
                status: 200,
                message: "Get user by authentication key",
                user: user,
            })
        }).catch(error => {
            console.log(error)
            res.status(500).json({
                status: 500,
                message: "Failed to get user by authentication key"
            })
        })
    }
)

//// Create user endpoint
const postCreateUserSchema = {
    type: "object",
    required: [
        "email",
        "password",
        "role",
        "firstName",
        "lastName"
    ],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        role: {
            type: "string"
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
    }
}

userController.post(
    "/users/register",
    // [
    // validate({ body: postCreateUserSchema }),
    // ],
    (req, res) => {
        // #swagger.summery = 'Create New User'
        // Get the user data out of the request body
        const userData = req.body
        console.log("🚀 ~ file: users.js:233 ~ userData:", userData)

        // Hash the password if it isn't already hashed
        if (!userData.password.startsWith("$2a")) {
            userData.password = bcrypt.hashSync(userData.password)
        }

        // Convert the user data into a User model object
        const user = User(
            null,
            userData.email,
            userData.password,
            userData.role,
            userData.firstName,
            userData.lastName,
            null
        )

        // Use the create model function to insert this user into the DB
        create(user).then(user => {
            res.status(200).json({
                status: 200,
                message: "Created user",
                user: user
            })
        }).catch(error => {
            console.log("🚀 ~ file: users.js:258 ~ create ~ error:", error)
            res.status(500).json({
                status: 500,
                message: "Failed to create user"
            })
        })
    }
)

//// Update user endpoint
const patchUpdateUserSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
        },
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        role: {
            type: "string"
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
    }
}

userController.patch(
    "/users",
    // auth(["Admin", "Trainer"]),
    // validate({ body: patchUpdateUserSchema }),
    (req, res) => {
        // Get user data out of the request
        const userData = req.body

        // Hash the password if it isn't already hashed
        if (!userData.password.startsWith("$2a")) {
            userData.password = bcrypt.hashSync(userData.password)
        }

        // Convert the user data into a User model object
        const user = User(
            userData.id,
            userData.email,
            userData.password,
            userData.role,
            userData.firstName,
            userData.lastName,
            userData.authenticationKey
        )

        // Use the update model function to update this user in the DB
        update(user).then(user => {
            res.status(200).json({
                status: 200,
                message: "Updated user",
                user: user
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to update user"
            })
        })


    }
)

userController.post("/users/upload/xml",
    // auth(["Admin"]),
    (req, res) => {
        if (req.files && req.files["xml-file"]) {
            // Access the XML file as a string
            const XMLFile = req.files["xml-file"]
            const file_text = XMLFile.data.toString()
            console.log(file_text);


            // Set up XML parser
            const parser = new xml2js.Parser();
            parser.parseStringPromise(file_text)
                .then(data => {
                    const userUpload = data["users-upload"]
                    const userUploadAttributes = userUpload["$"]
                    const operation = userUploadAttributes["operation"]
                    // Slightly painful indexing to reach nested children
                    const usersData = userUpload["users"][0]["user"]

                    if (operation == "insert") {
                        Promise.all(usersData.map((userData) => {
                            if (!userData.Password.toString().startsWith("$2a")) {
                                userData.Password = bcrypt.hashSync(userData.Password.toString(), 10);
                            }

                            // Convert the xml object into a model object
                            const userModel = User(
                                null,
                                userData.Email.toString(),
                                userData.Password.toString(),
                                userData.Role.toString(),
                                userData.FirstName.toString(),
                                userData.LastName.toString(),
                                userData.AuthenticationKey ? userData.AuthenticationKey.toString() : null
                            );
                            // Return the promise of each creation query
                            return createUserXML(userModel)
                        })).then(results => {
                            res.status(200).json({
                                status: 200,
                                message: "XML Upload insert successful",
                            })
                        }).catch(error => {
                            res.status(500).json({
                                status: 500,
                                message: "XML upload failed on database operation - " + error,
                            })
                        })
                    } else if (operation == "update") {
                        Promise.all(usersData.map((userData) => {
                            // Convert the xml object into a model object
                            const userModel = User(
                                null,
                                userData.Email.toString(),
                                userData.Password.toString(),
                                userData.Role.toString(),
                                userData.FirstName.toString(),
                                userData.LastName.toString(),
                                userData.AuthenticationKey ? userData.AuthenticationKey.toString() : null
                            );
                            // Return the promise of each creation query
                            return updateUserXML(userModel)
                        })).then(results => {
                            res.status(200).json({
                                status: 200,
                                message: "XML Upload update successful",
                            })
                        }).catch(error => {
                            res.status(500).json({
                                status: 500,
                                message: "XML upload failed on database operation - " + error,
                            })
                        })

                    } else {
                        res.status(400).json({
                            status: 400,
                            message: "XML Contains invalid operation attribute value",
                        })
                    }
                })
                .catch(error => {
                    res.status(500).json({
                        status: 500,
                        message: "Error parsing XML - " + error,
                    })
                })


        } else {
            res.status(400).json({
                status: 400,
                message: "No file selected",
            })
        }
    })

//// Delete user endpoint
const deleteUserByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
        }
    }
}

userController.delete("/users/:id",
    // auth(["Admin"]),

    // validate({ params: deleteUserByIDSchema }),
    (req, res) => {
        const userID = req.params.id

        deleteByID(userID)
            .then(result => {
                res.status(200).json({
                    status: 200,
                    message: "Deleted User by ID"
                })
            }).catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to delete user by ID"
                })
            })
    }
)

export default userController