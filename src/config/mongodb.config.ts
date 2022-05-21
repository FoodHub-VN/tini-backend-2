import {registerAs} from "@nestjs/config";
export default registerAs('mongodb', () => {
    let {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
    } = process.env;
    DB_HOST = DB_HOST || "localhost";
    DB_PORT = DB_PORT || "27017";
    DB_NAME = DB_NAME || "nestjs-test"
    console.log("uri: ", `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
    return {
        uri:`mongodb://${DB_HOST}:${DB_PORT}`
    };
});