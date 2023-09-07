import { getSession } from "../libs/localStorage";

export default function PlayPage() {
    const session = getSession();

    if (!session) {
        return <></>;
    }

    return <>
        <h1>Room: {session.name}</h1>
        <p>Category: {session.category.name}</p>
        <p>Status: Waiting...</p>
    </>
}