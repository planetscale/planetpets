import Head from 'next/head'
import Header from 'components/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>With Iron Session</title>
      </Head>
      <Header />

      <main>
        <div className="container">{children}</div>
      </main>
    </>
  )
}
