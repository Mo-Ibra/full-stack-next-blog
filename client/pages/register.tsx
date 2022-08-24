import { Navbar, RegisterForm } from "../components";

import { GetServerSideProps } from "next";

import cookie from 'cookie';

import { profileAPI } from "../services/auth.services";

import { useEffect } from "react";

import Router from 'next/router';

type RegisterProps = {
    data: {
        status: number
    },
}

const Register = ({ data }: RegisterProps) => {

    useEffect(() => {
        if (data.status === 200) {
            Router.push('/');
        }
    }, [data]);

    return (
        <>
            <Navbar data={data} token="" />
            <RegisterForm />
        </>
    )
}

export default Register;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const parsedToken: string = cookie.parse(context.req.headers.cookie).token;
    
    const data = await profileAPI(parsedToken);
    
    return {
        props: {
            data,
        }
    }
}