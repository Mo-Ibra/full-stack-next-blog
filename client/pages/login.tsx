import { GetServerSideProps } from 'next';

import { LoginForm, Navbar } from "../components"

import cookie from 'cookie';

import { profileAPI } from "../services/auth.services";

import { useEffect } from "react";

import Router from "next/router";

type LoginProps = {
    data: {
        status: number
    },
}

const Login = ({ data }: LoginProps) => {

    useEffect(() => {
        if (data.status === 200) {
            Router.push('/');
        }
    }, [data]);

    return (
        <>
            <Navbar data={data} />
            <LoginForm />
        </>
    )
}

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const parsedToken: string = cookie.parse(context.req.headers.cookie).token;
    
    const data = await profileAPI(parsedToken);
    
    return {
        props: {
            data,
        }
    }
}