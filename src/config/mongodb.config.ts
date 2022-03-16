import {registerAs} from "@nestjs/config";
export default registerAs('mongodb', () => {
    const {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
    } = process.env;
    console.log("uri: ", `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
    return {
        uri:`mongodb://${DB_HOST}:${DB_PORT}`
    };
});