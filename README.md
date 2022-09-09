# PlanetPets: An example OAuth application for PlanetScale

<p align="center"><b>Online demo at <a href="https://iron-session-example.vercel.app/(https://planetpets.vercel.app/login)">[https://iron-session-example.vercel.app](https://planetpets.vercel.app/login)</a></b></p>

---

This example OAuth application shows how to use PlanetScale's OAuth system. The entire flow of OAuth within PlanetPets looks like:

| OAuth Step | Within PlanetPets |
| --- | ----------- |
| User is authenticated within the partner app | User signs into PlanetPets using their Github account |
| User is directed to sign into their PlanetScale account and authorizes the partner app on their PS account | User is directed to `https://app.planetscale.com/oauth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI` from `https://planetpets.vercel.app/` |
| User is redirected to REDIRECT_URI with `code` as a query parameter | User is redirected to `https://planetpets.vercel.app/api/callback?code=CODE`|
| Partner application exchanges `code` for an `access token` | [`code` is exchanged for an `access token`](https://github.com/notfelineit/planetpets/blob/main/pages/api/callback.ts#L15-L31) |
| Partner uses access token to make requests to PlanetScale's public API | PlanetPets requests the users' [organizations](https://github.com/notfelineit/planetpets/blob/main/pages/play.tsx#L28-L36) and [databases](https://github.com/notfelineit/planetpets/blob/main/pages/play.tsx#L39-L47) |
