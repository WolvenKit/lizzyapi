import express from "express";
const router = express.Router();
import prm_client from "prom-client";
import { log, client } from "utils";

const gauge_time = new prm_client.Gauge({
  name: "api_role_time",
  help: "Time taken to get roles",
});

const gauge_count = new prm_client.Gauge({
  name: "api_role_use_count",
  help: "Time taken to get roles",
});

router.get("/", (req, res) => {
  try {
    if (!req.query.server || typeof req.query.server !== "string") {
      return res.status(400).send("Invalid query");
    }
    gauge_time.setToCurrentTime();
    const end = gauge_time.startTimer();

    const send = [
      client.guilds.cache
        .get(req.query.server.trim())
        ?.roles.cache.map((role) => {
          return {
            Role: role.name,
            Members: role.members.map((member) => {
              return {
                Username: member.user.username,
                Discriminator: member.user.discriminator,
                ID: member.user.id,
                Bot: member.user.bot,
              };
            }),
          };
        }),
    ];
    end();
    gauge_count.inc(1);

    log("Roles sent");
    return res.send(send);
  } catch (e) {
    log(e);
    return res.sendStatus(500);
  }
});

export default router;
