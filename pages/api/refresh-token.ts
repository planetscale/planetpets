import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from './user'

/**
 * refreshTokenRoute uses a refresh token to fetch a new OAuth token on behalf of the user
 */
async function refreshTokenRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  // Fetch the existing refresh token from the user session
  const { refreshToken: oldRefreshToken } = req.session.user || {}
  let planetscaleToken, planetscaleTokenId, refreshToken: string | undefined = undefined
  
  if (oldRefreshToken) {
    // Make a request to the PlanetScale API to exchange the refresh token for a new OAuth token
    const tokenRes = await fetch(
      `${process.env.PLANETSCALE_API_URL}/organizations/${process.env.ORGANIZATION_NAME}/oauth-applications/${process.env.APP_ID}/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${oldRefreshToken}`,
      {
        method: 'post',
        headers: new Headers({
          'Authorization': `${process.env.PLANETSCALE_SERVICE_TOKEN_ID}:${process.env.PLANETSCALE_SERVICE_TOKEN_TOKEN}`
      })
      }
    )

    // Parse the returned OAuth token for the token secret `token.token`, token id `token.id`, and a new refresh token `token.plain_text_refresh_token`
    const token = await tokenRes.json()
    planetscaleToken = token.token
    planetscaleTokenId = token.id
    refreshToken = token.plain_text_refresh_token
  }

  if (req.session.user) {
    // Update the user session with the new OAuth token parameters
    req.session.user = { ...req.session.user, planetscaleToken, planetscaleTokenId, refreshToken }
    await req.session.save()
    res.json(req.session.user)
  } else {
    res.json({
      isLoggedIn: false,
      login: '',
      avatarUrl: '',
    })
  }
}

export default withIronSessionApiRoute(refreshTokenRoute, sessionOptions)
