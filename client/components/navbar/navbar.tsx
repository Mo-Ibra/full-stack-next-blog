import Link from "next/link";

import Router from "next/router";

import { logout } from "../../services/auth.services";

export type DataTypes = {
    data: {
        status: number,
        name?: string;
        email?: string;
        isAdmin?: boolean;
    },
    token: string;
}

const Navbar = ({ data, token }: DataTypes) => {

    const logoutHandler = () => {
        
        const logoutAPI = logout(token);

        logoutAPI.then(data => {
            if (data.status === 200) {
                Router.push('/');
            }
        });
    }

    return (
        <nav className="py-4 bg-white shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-10">
                <div className="flex justify-between items-center">
                    <div>
                        <Link href="/">
                            <h2 className="font-bold text-gray-800 cursor-pointer">Next BLOG</h2>
                        </Link>
                    </div>
                    <div>
                        {
                            data.status === 200 ? (
                                <button
                                    className="text-red-500 border border-red-500 mx-2 py-1 px-4 text-sm rounded-sm hover:bg-red-500 hover:text-white duration-300"
                                    onClick={logoutHandler}
                                >Logout</button>
                            ) : (
                                <Link href="/login">
                                    <button
                                        className="bg-blue-500 text-white py-1 px-4 text-sm rounded-sm"
                                    >
                                        Login
                                    </button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;