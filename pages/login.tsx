import React, { useState } from 'react'
import useUser from 'lib/useUser'
import Layout from 'components/Layout'
import Form from 'components/Form'
import fetchJson, { FetchError } from 'lib/fetchJson'

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('')

  return (
    <Layout>
      <div className="login">
        <div id='images'>
          <img src='title@2x.png' />
          <img src='green_lilman@2x.png'/>
        </div>
        <Form
          errorMessage={errorMsg}
          onSubmit={async function handleSubmit(event) {
            event.preventDefault()

            const body = {
              username: event.currentTarget.username.value,
            }

            try {
              mutateUser(
                await fetchJson('/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                })
              )
            } catch (error) {
              if (error instanceof FetchError) {
                setErrorMsg(error.data.message)
              } else {
                console.error('An unexpected error happened:', error)
              }
            }
          }}
        />
      </div>
      <style jsx>{`
        .login {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
        }

        #images {
          display: flex;
          flex-direction: column;
        }

        #images.img {
          flex-grow: 0;
          flex-shrink: 0;
          max-width: 100px;
        }
      `}</style>
    </Layout>
  )
}
