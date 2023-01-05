import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from './user'
import url from 'url'

async function refreshTokenRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  const { refreshToken: oldRefreshToken } = req.session.user || {}
  let planetscaleToken, planetscaleTokenId, refreshToken: string | undefined = undefined
  
  if (oldRefreshToken) {
    const tokenRes = await fetch(
      `${process.env.PLANETSCALE_API_URL}/organizations/${process.env.ORGANIZATION_NAME}/oauth-applications/${process.env.APP_ID}/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${oldRefreshToken}`,
      {
        method: 'post',
        headers: new Headers({
          'Authorization': `${process.env.PLANETSCALE_SERVICE_TOKEN_ID}:${process.env.PLANETSCALE_SERVICE_TOKEN_TOKEN}`
      })
      }
    )

    const token = await tokenRes.json()
    console.log(token)
    planetscaleToken = token.token
    planetscaleTokenId = token.id
    refreshToken = token.plain_text_refresh_token
  }

  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
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
