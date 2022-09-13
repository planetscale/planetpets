import Link from 'next/link'
import useUser from 'lib/useUser'
import { useRouter } from 'next/router'
import Image from 'next/image'
import fetchJson from 'lib/fetchJson'
import { User } from 'pages/api/user'

export default function Header() {
  const { user, mutateUser } = useUser()
  const router = useRouter()

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {user?.isLoggedIn === false && (
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
          )}
          {user?.planetscaleToken && (
            <li>
              <a
                onClick={async () => {
                  const res = await fetchJson<User>('/api/refresh-token', { method: 'POST' })
                  if (res.planetscaleToken) {
                    router.reload()
                  }
                }}
              >
                Refresh Token
              </a>
            </li>
          )}
          {user?.isLoggedIn === true && (
            <>
              <li>
                <a
                  href="/api/logout"
                  onClick={async (e) => {
                    e.preventDefault()
                    mutateUser(
                      await fetchJson('/api/logout', { method: 'POST' }),
                      false
                    )
                    router.push('/login')
                  }}
                >
                  Logout
                </a>
              </li>
              <li>
                <span
                  style={{
                    marginRight: '.3em',
                    verticalAlign: 'middle',
                    borderRadius: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={user.avatarUrl}
                    width={32}
                    height={32}
                    alt=""
                  />
                </span>
              </li>
              {/* For demo purposes only - don't show your token value in your application */}
              { user.planetscaleToken && <li>Token: {user.planetscaleToken}</li>}
            </>
          )}
        </ul>
      </nav>
      <style jsx>{`
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }

        li {
          margin-right: 1rem;
          display: flex;
          align-items: center;
        }

        li:first-child {
          margin-left: auto;
        }

        a {
          text-decoration: none;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        a img {
          margin-right: 1em;
        }

        header {
          padding: 0.2rem;
        }
      `}</style>
    </header>
  )
}
