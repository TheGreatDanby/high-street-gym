import { MongoClient } from "mongodb"

// TODO: Add connection String from Atlas
const connectionString =
    "mongodb+srv://thegreatdanby:aycfcTA6Q1SYWyys@cluster0.ug1ixps.mongodb.net/test?proxyHost=mongodb.bypass.host&proxyPort=80&proxyUsername=student&proxyPassword=student"
const client = new MongoClient(connectionString)
export const db = client.db("classes")
