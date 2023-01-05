import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from './user'
import url from 'url'

/**
 * callbackRoute is called when a GET request is made to the `/api/callback` route
 * 1. It parses the authorization code `code` from the request url (i.e. `/api/callback?code=CODE`)
 * 2. It makes a request to the PlanetScale API to exchange the authorization code `code` for an OAuth token `token`
 * 3. It saves the token secret as `planetscaleToken`, the token ID as `planetscaleTokenId`, and a refresh token as `refreshToken` in the user session
 * 4. It redirects to `/play` 
 */
async function callbackRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  // Fetch the `code` from the URL query parameters
  const { code } = url.parse(req.url as string, true).query;
  let planetscaleToken, planetscaleTokenId, refreshToken: string | undefined = undefined

  if (code) {
    // Make a request to exchange the `code` for an OAuth token
    const tokenRes = await fetch(
      `${process.env.PLANETSCALE_API_URL}/organizations/${process.env.ORGANIZATION_NAME}/oauth-applications/${process.env.APP_ID}/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URI}`,
      {
        method: 'post',
        headers: new Headers({
          // Use an existing PlanetScale service token with `write_oauth_tokens` access for authorization to the PlanetScale API
          'Authorization': `${process.env.PLANETSCALE_SERVICE_TOKEN_ID}:${process.env.PLANETSCALE_SERVICE_TOKEN_TOKEN}`
      })
      }
    )

    // Parse the returned OAuth token for the token secret `token.token`, token id `token.id`, and refresh token `token.plain_text_refresh_token`
    const token = await tokenRes.json()
    planetscaleToken = token.token
    planetscaleTokenId = token.id
    refreshToken = token.plain_text_refresh_token
  }

  if (req.session.user) {
    // In a real world application, you might read the user id from the session, and then do a database request
    // to get more information on the user if needed
    req.session.user = { ...req.session.user, planetscaleToken, planetscaleTokenId, refreshToken }
    await req.session.save()

    res.redirect(307, '/play')
  } else {
    res.json({
      isLoggedIn: false,
      login: '',
      avatarUrl: '',
    })
  }
}

export default withIronSessionApiRoute(callbackRoute, sessionOptions)
