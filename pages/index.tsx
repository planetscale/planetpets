import Layout from 'components/Layout'
import useUser from 'lib/useUser'

export default function Home({ url }: { url: string }) {
  const { user } = useUser({
    redirectTo: '/login',
  })

  return (
    <Layout>
        <div>
          <img src='green_lilman@2x.png' style={{ position: 'absolute', bottom: -150}}/>
          {!user?.planetscaleToken && (
            <div style={{ fontWeight: 'bold', position: 'absolute', bottom: 50, left: 250 }}>
              It looks empty here...do you want to <a href={url}>connect to your Planetscale account?</a>
            </div>
          )}
          {user?.planetscaleToken && (
            <div style={{ fontWeight: 'bold', position: 'absolute', bottom: 50, left: 250 }}>
              We should probably <a href='play'>check on the gardens...</a>
            </div>
          )}
        </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const url = `${process.env.PLANETSCALE_APP_URL}/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  return {
    props: { url }, // Will be passed to the Home component as props
  }
}
