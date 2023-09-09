import { formToJSON } from "axios";
import { useNavigate } from "react-router-dom";
import { prettyAxios } from "../utils/promise";
import { api } from "../libs/axios";
import { getItem, setItem } from "../libs/localStorage";
import { useEffect } from "react";

export default function HomePage() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = formToJSON(e.target);

        const join = await prettyAxios(
            api.post(`/sessions/join/${payload.sessionId}`, {
                username: payload.username,
            })
        );

        if (join.isError) {
            return alert(join.data.message);
        }

        setItem("session", join.data.data.session);
        setItem("user", join.data.data.user);
        navigate("/play");

        // localStorage.setItem("session", JSON.stringify(join.data.data.session));
        // localStorage.setItem("user", JSON.stringify(join.data.data.user));

        // console.log(localStorage.getItem("session"));
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit}>
                <div className="text-xl space-y-4 mb-4">
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
        </div>
    );
}
