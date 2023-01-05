<p align="center" width="100%">
    <img src="/green_lilman@2x.png"> 
</p>
<p align="center" width="100%">
    <img src="/title@2x.png"> 
</p>

# PlanetPets: An example OAuth application for PlanetScale

This example OAuth application shows how to use PlanetScale's OAuth system. 

PlanetPets is a simple app that users "sign in" to using their GitHub account. Afterwards, users are prompted to give PlanetPets access to their PlanetScale account. The user's organizations are then presented as "gardens" where their databases are "trees". Within PlanetPets, users can water their "trees" to grow new branches - this creates a new branch in their database with a randomly generated name.

## OAuth Flow
The entire flow of OAuth within PlanetPets looks like:
| OAuth Step | Within PlanetPets |
| --- | ----------- |
| 1. User is authenticated within the partner app | User signs into PlanetPets using their Github account at `/login` |
| 2. User is directed to sign into their PlanetScale account and authorizes the partner app on their PS account | User is directed to `https://app.planetscale.com/oauth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI` from `https://planetpets.preview.planetscale.com` when they [click this link](https://github.com/planetscale/planetpets/blob/main/pages/index.tsx#L15)|
| 3. PlanetScale redirects to REDIRECT_URI with `code` as a query parameter | PlanetScale redirects to [`https://planetpets.preview.planetscale.com/api/callback?code=CODE`](https://github.com/planetscale/planetpets/blob/main/pages/api/callback.ts)|
| 4. Partner application exchanges `code` for an `access token` | [`code` is exchanged for an `access token`](https://github.com/planetscale/planetpets/blob/main/pages/api/callback.ts#L15-L31) |
| 5. Partner uses access token to make requests to PlanetScale's public API | PlanetPets requests the users' [organizations](https://github.com/planetscale/planetpets/blob/main/pages/play.tsx#L28-L36) and [databases](https://github.com/notfelineit/planetpets/blob/main/pages/play.tsx#L39-L47) |
| 6. Partner can refresh the access token using `plain_text_refresh_token` | The refresh token is used to [request a new `access token`](https://github.com/planetscale/planetpets/blob/main/pages/api/refresh-token.ts#L8-L26) |

## Environment Variables
This demo uses a number of Vercel environment variables that you'll likely need in your OAuth application as well. The most important ones include:
- your OAuth application ID, client ID, and client secret
- your service token secret and ID
- your PlanetScale organization name
<img width="927" alt="Screen Shot 2023-01-05 at 1 41 20 PM" src="https://user-images.githubusercontent.com/31225471/210885462-862f5ce4-fa49-4349-8a59-1b1f6346dd1c.png">
