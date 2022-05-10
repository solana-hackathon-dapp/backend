import {createClient} from "redis";
import logger from "./logger";

const redis = createClient(
    {
        url: "redis://localhost:6379"
    }
)

redis.connect().then(() => {
    logger.info("Connect to Redis");
}).catch((err) => {
    logger.error("Can not connect to Redis");
})

export default redis;