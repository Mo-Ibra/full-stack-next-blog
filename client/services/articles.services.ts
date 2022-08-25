import { URL } from "./auth.services";

export async function getArticles() {
    const response = await fetch(`${URL}/api/articles`);
    const data = await response.json();
    return data;
};