export async function handleResponse(response) {
    const data = await response.json();
    return { statusCode: response.status, ...data };
}
