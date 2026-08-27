// Init our express server
import knex from "knex";
import db from "./db";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;


// Strava Oauth route
app.get("/exchange_token", async (req, res) => {
    const code = req.query.code as string;

    try {
        const response = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.STRAVA_CLIENT_ID!,
                client_secret: process.env.STRAVA_CLIENT_SECRET!,
                code: code,
                grant_type: "authorization_code",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Strava error:", errorText);
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);


        // update our data 
       const update = await db('athletes').where({ strava_id : data.athlete.id})
       .update({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_expires_at: new Date(data.expires_at * 1000)

       });
       res.send("Authorization successful! Tokens saved.");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});


// Get activities
app.post("/activities", async (req, res) => {

    try {

        const activities = await db('athletes').where({ internal_id : 1}).select("access_token");
        const access_token = activities[0].access_token;
        

        const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Strava error:", errorText);
            throw new Error(`Response status: ${response.status}`);
        }

        for (const activity of data) {
            await db('activities').insert({
                athlete_id: 1,
                activity_id: activity.id,
                activity_name: activity.name,
                activity_type: activity.type,
                distance: activity.distance,
                elapsed_time: activity.elapsed_time,
                moving_time: activity.moving_time,
                start_time: activity.start_date
            }).onConflict('activity_id').ignore();
        };
        res.send("Fetched successfully.");

    

    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
    
});

// send weekly mileage
app.get("/stats/weekly-mileage", async(req, res) => {

    try {
        const mileage = await db.raw(`
                        SELECT date_trunc('week', start_time)::date AS week, SUM(distance)/1000 AS total_distance_km
                        FROM activities
                        GROUP BY week
                        ORDER BY week`       
                    );

        console.log(mileage);
        res.json(mileage.rows);
    }
    

    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
    

});

// pace trend route
app.get("/stats/pace-trend", async(req, res) => {
    try {
        const pace_trend = await db.raw(`
                            SELECT date_trunc('week', start_time)::date AS week, 
                            ROUND(AVG((moving_time / 60.0) / (distance / 1000.0)), 2) AS avg_pace_min_per_km
                            FROM activities
                            GROUP BY week
                            ORDER BY week;`
                        );
        console.log(pace_trend);
        res.json(pace_trend.rows)

    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }


});

// 5k
app.get("/stats/personal-record-5k", async(req, res) => {
    try {
        const record_5k = await db.raw(`
                            SELECT activity_name, distance, moving_time, start_time
                            FROM activities
                            WHERE distance BETWEEN 4800 AND 5200
                            ORDER BY moving_time ASC
                            LIMIT 1;`);

        console.log(record_5k);
        res.json(record_5k.rows);

    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }


});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

});