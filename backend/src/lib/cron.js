import corn from "cron";
import https from "https";

const job = new corn.CronJob("/14 * * *", function () {
    https
        .get(process.env.API_URL, (res) => {
            if (res.statusCode === 200) console.log("Cron job executed successfully at", new Date());
            else console.log("GET request failed", res.statusCode);
        })
        
        .on("error", (e) => console.error("Error with GET request:", e));
});

export default job;