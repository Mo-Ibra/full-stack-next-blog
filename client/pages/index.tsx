import type { GetServerSideProps } from 'next'

import { Navbar } from '../components'

import { profileAPI } from '../services/auth.services'

import cookie from 'cookie';

export type DataTypes = {
  data: {
      status: number,
      name?: string;
      email?: string;
      isAdmin?: boolean;
  },
  token: string;
}

const Home = ({ data, token }: DataTypes) => {
  return (
    <>
      <Navbar data={data} token={token}/>
      {
        data.status === 200 && (
          <div>
            <h3>Hello {data.name}</h3>
            <h5>Your email is {data.email}</h5>
            <p>You are {data.isAdmin ? 'Admin' : 'Not Admin'}</p>
          </div>
        )
      }
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {

  const token = cookie.parse(context.req.headers.cookie).token

  const parsedToken = token;

  const data = await profileAPI(parsedToken);

  return {
    props: {
      data,
      token: token ? token : null,
    }
  }
}