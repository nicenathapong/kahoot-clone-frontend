import { formToJSON } from "axios";
import { useNavigate } from "react-router-dom";
import { prettyAxios } from "../utils/promise";
import { api } from "../libs/axios";
import { getSession } from "../libs/localStorage";
import { useEffect } from "react";

export default function HomePage() {
    const session = getSession();

    const navigate = useNavigate();

    console.log(session);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = formToJSON(e.target);

        const join = await prettyAxios(
            api.post(`/sessions/join/${payload.sessionId}`, {
                username: payload.username
            })
        );

        if (join.isError) {
            return alert(join.data.message);
        }

        localStorage.setItem("session", JSON.stringify(join.data.data.session));
        localStorage.setItem("user", JSON.stringify(join.data.data.user));

        console.log(localStorage.getItem("session"));
    };

    useEffect(() => {
        if (session) {
            navigate("/play");
        }
    }, []);

    if (session) {
        return <></>;
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-4">
                    <div>
                        <p>Room ID</p>
                        <input
                            type="text"
                            name="sessionId"
                            className="bg-gray-200"
                            required
                        />
                    </div>
                    <div>
                        <p>Username</p>
                        <input
                            type="text"
                            name="username"
                            className="bg-gray-200"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="underline">
                    Join
                </button>
            </form>
        </>
    );
}
