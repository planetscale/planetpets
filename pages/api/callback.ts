import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import url from 'url'

export type User = {
  isLoggedIn: boolean
  login: string
  avatarUrl: string
  planetscaleToken?: string
}

async function callbackRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  const queryObject = url.parse(req.url as string, true).query;
  console.log(queryObject);
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    req.session.user = { ...req.session.user, planetscaleToken: queryObject.code as string}
    await req.session.save()

    res.json({
      ...req.session.user,
      isLoggedIn: true,
      planetscaleToken: queryObject.code as string
    })
  } else {
    res.json({
      isLoggedIn: false,
      login: '',
      avatarUrl: '',
    })
  }
}

export default withIronSessionApiRoute(callbackRoute, sessionOptions)
