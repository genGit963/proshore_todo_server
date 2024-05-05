import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongodbConnection from "./database/mongodb.js";
import app from "./app.js";

// monogodb connection then app-server listen
mongodbConnection()
    .then(() => {
        app.listen(process.env.PORT, () =>
            console.log(`Server: http://localhost:${process.env.PORT}`)
        );
    })
    .catch((error) => {
        console.log("--X-- @index: ", error);
    });

// app.listen(process.env.PORT, () =>
//     console.log("Server: http://localhost:", process.env.PORT)
// );
