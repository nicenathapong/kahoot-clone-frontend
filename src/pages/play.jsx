import { useNavigate } from "react-router-dom";
import { api } from "../libs/axios";
import { getItem, removeItem, setItem } from "../libs/localStorage";
import { prettyAxios } from "../utils/promise";
import { useEffect, useState } from "react";
import { getUserCorrectAnswerCount } from "../utils/session";

export default function PlayPage() {
    const [session, setSession] = useState(getItem("session"));
    const user = getItem("user");

    const navigate = useNavigate();

    const handleLeaveRoomClick = async (e) => {
        e.preventDefault();

        if (!confirm("คุณต้องการจะออกจากห้องนี้จริงๆ หรือไม่?")) {
            return;
        }

        await prettyAxios(api.post(`/sessions/leave/${session.id}/${user.id}`));

        removeItem("session");
        removeItem("user");
        navigate("/");
    };

    const handleSubmitAnswerClick = async (e, idx) => {
        e.preventDefault();

        const submit = await prettyAxios(
            api.post(`/sessions/submit/${session.id}/${user.id}`, {
                choiceIndex: idx,
            })
        );

        if (submit.isError) {
            return alert(submit.data.message);
        }
        const _session = await prettyAxios(api.get(`/sessions/${session.id}`));
        if (_session.isError) {
            return alert(_session.data.message);
        }
        setItem("session", _session.data.data);
        setSession(_session.data.data);
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const _session = await prettyAxios(
                api.get(`/sessions/${session.id}`)
            );
            if (_session.isError) {
                alert(_session.data.message);
                return clearInterval(interval);
            }
            setItem("session", _session.data.data);
            setSession(_session.data.data);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!session || !user) {
        return <></>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold">
                        {session.category.name}
                    </h1>
                    <h1 className="text-4xl">รหัสห้อง: {session.id}</h1>
                    <h1>Username: {user.username}</h1>
                    <p>Status: {session.status}</p>
                </div>
                <button
                    type="button"
                    className="underline text-red-500"
                    onClick={handleLeaveRoomClick}
                >
                    ออกจากห้อง
                </button>
            </div>

            {session.status === "WAITING" && (
                <>
                    <h1 className="text-xl mb-4 text-center">
                        มีคนเข้าห้องมาแล้ว {session.users.length} คน
                    </h1>
                    <div className="p-4 border border-black/20 mb-8">
                        {session.users.length ? (
                            <div className="flex flex-wrap gap-4">
                                {session.users.map((u, idx) => (
                                    <p key={idx}>{u.username}</p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-black/40">
                                กำลังรอคนเข้าห้อง...
                            </p>
                        )}
                    </div>
                </>
            )}

            {session.status === "PLAYING" && (
                <>
                    <div className="text-2xl mb-4">
                        <h1>
                            {session.currentQuestionIndex + 1}
                            {")."}{" "}
                            {
                                session.category.questions[
                                    session.currentQuestionIndex
                                ].title
                            }
                        </h1>
                        {session.choiceStatus === "SUCCESS" && (
                            <h1 className="text-green-500">
                                เฉลย:{" "}
                                {
                                    session.category.questions[
                                        session.currentQuestionIndex
                                    ].choices.find((c) => c.correct).title
                                }
                            </h1>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {session.category.questions[
                            session.currentQuestionIndex
                        ].choices.map((c, idx) => (
                            <button
                                type="button"
                                key={idx}
                                className={`border border-black/20 p-6 ${
                                    session.users
                                        .find((u) => u.id === user.id)
                                        .answers.find(
                                            (a) =>
                                                a.questionIndex ===
                                                session.currentQuestionIndex
                                        )?.choiceIndex === idx
                                        ? "bg-blue-200"
                                        : ""
                                }`}
                                onClick={(e) => handleSubmitAnswerClick(e, idx)}
                            >
                                <h1 className="text-xl">{c.title}</h1>
                            </button>
                        ))}
                    </div>
                </>
            )}

            {session.status === "SUCCESS" && (
                <>
                    <h1 className="text-4xl font-bold text-green-500">
                        เสร็จสิ้น
                    </h1>
                    <h1 className="text-xl font-bold mb-4">
                        มาดูผู้เล่นที่ตอบคำถามได้ถูกต้องมากที่สุดกัน
                    </h1>
                    <div className="border border-black/20 p-4 space-y-2">
                        {session.users
                            .sort((a, b) => {
                                const aCount = getUserCorrectAnswerCount(
                                    session,
                                    a
                                );
                                const bCount = getUserCorrectAnswerCount(
                                    session,
                                    b
                                );
                                return bCount - aCount;
                            })
                            .map((u, idx) => (
                                <p className="text-xl">
                                    {idx + 1}
                                    {")."} {u.username} ตอบถูก{" "}
                                    {getUserCorrectAnswerCount(session, u)} ข้อ
                                </p>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
