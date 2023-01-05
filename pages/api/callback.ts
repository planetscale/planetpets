import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from './user'
import url from 'url'

async function callbackRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  const { code } = url.parse(req.url as string, true).query;
  let planetscaleToken, planetscaleTokenId, refreshToken: string | undefined = undefined

  if (code) {
    const tokenRes = await fetch(
      `${process.env.PLANETSCALE_API_URL}/organizations/${process.env.ORGANIZATION_NAME}/oauth-applications/${process.env.APP_ID}/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URI}`,
      {
        method: 'post',
        headers: new Headers({
          'Authorization': `${process.env.PLANETSCALE_SERVICE_TOKEN_ID}:${process.env.PLANETSCALE_SERVICE_TOKEN_TOKEN}`
      })
      }
    )
    const token = await tokenRes.json()
    planetscaleToken = token.token
    planetscaleTokenId = token.id
    refreshToken = token.plain_text_refresh_token
  }

  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
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
