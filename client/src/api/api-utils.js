import { auth } from "../Config/auth";


export async function getHeaders(extraHeaders = {}) {

    const user = auth.currentUser;

    if (!user) {
        return; 
    }

    const token = await user.getIdToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...extraHeaders 
    };
}





export async function handleResponse(response) {
    const data = await response.json();
    return { statusCode: response.status, data: data };
}
