import { app } from "./app";
import { config } from "./config/config";
import { connectDB } from "./config/db";

connectDB()
    .then(() => {
        const port = config.port || 3000;

        app.listen(port, () => {
            console.log(`The server is listening on ${port}`);
        });
    })
    .catch((error) => {
        console.error(
            `Something went wrong while Starting the server ${error}`
        );
    });
