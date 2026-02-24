import arcjet, { shield, detectBot, tokenBucket } from "arcjet";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
  key: ARCJET_KEY,

  client: {
    ip: (req) => req.ip,
    userAgent: (req) => req.headers["user-agent"],
  },

  log: {
    debug: console.log,
    info: console.log,
    warn: console.warn,
    error: console.error,
  },

  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;