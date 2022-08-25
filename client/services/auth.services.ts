export const URL = "http://localhost:8000/api";

type LoginTypes = {
    email: string;
    password: string;
}

export async function login({ email, password }: LoginTypes) {
    const response = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
        credentials: "include"
    });
    const data = await response.json();
    return data;
}

type RegisterTypes = {
    name: string;
    email: string;
    password: string;
}

export async function register({ name, email, password }: RegisterTypes) {
    const response = await fetch(`${URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, password: password }),
    });
    const data = await response.json();
    return data;
}

export async function logout(token: string) {
    const response = await fetch(`${URL}/auth/logout`, {
        headers: {
            // "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: "include"
    });
    const data = await response.json();
    return data;
}

/** Profile API */
export async function profileAPI(token: string) {
    const response = await fetch(`${URL}/auth/profile`, {
        headers: {
            // "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        credentials: "include"
    });
    const data = await response.json();
    return data;
}