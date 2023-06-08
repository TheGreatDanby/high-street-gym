import express from "express"
import cors from "cors"
// import { validateErrorMiddleware } from "./middleware/validator.js"
import fileUpload from "express-fileupload"

// Create express application 
const port = 8082
const app = express()

// Enable cross-origin resource sharing (CORS)
// 
// CORS allows us to set what front-end URLs are allowed
// to access this API
app.use(cors({
    // Allow all origins
    origin: true,
}))

// Enable JSON request parsing middleware.
app.use(express.json())

// Enable file upload support
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

// Import and enable swagger documentation pages
// import docsRouter from "./middleware/swagger-doc.js"
// app.use(docsRouter)

// Import and use controllers
// import bodyParser from "body-parser";
// app.use(bodyParser.json());
import classesController from "./controllers/classes.js"
app.use(classesController)
import userController from "./controllers/users.js"
app.use(userController)
import messageController from "./controllers/blog.js"
app.use(messageController)
import docsRouter from "./middleware/swagger-doc.js"
app.use(docsRouter)



// Import and use validation error handing middleware
// app.use(validateErrorMiddleware)

// Start listening for API requests 
app.listen(port, () => {
    console.log(`Express stared on  http://localhost:${port}`)
})