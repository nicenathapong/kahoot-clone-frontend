export async function prettyPromise(promise) {
    return promise
        .then((data) => ({
            isError: false,
            data,
        }))
        .catch((err) => ({
            isError: true,
            data: err,
        }));
}

export async function prettyAxios(promise) {
    return prettyPromise(promise).then((result) => ({
        isError: result.isError,
        data: result.isError ? result.data?.response?.data : result.data?.data,
    }));
}

export function sleep(duration = 500) {
    return new Promise(r => setTimeout(r, duration));
}