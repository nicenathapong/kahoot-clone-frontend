import { useNavigate } from "react-router-dom";
import { removeItem, getItem, setItem } from "../../libs/localStorage";
import { prettyAxios } from "../../utils/promise";
import { api } from "../../libs/axios";
import { useEffect, useState } from "react";
import { getUserCorrectAnswerCount } from "../../utils/session";

export default function AdminPlayPage() {
    const [session, setSession] = useState(getItem("adminSession"));

    const navigate = useNavigate();

    const handleDeleteRoomClick = async (e) => {
        e.preventDefault();

        if (!confirm("คุณต้องการจะลบห้องนี้จริงๆ หรือไม่?")) {
            return;
        }

        await prettyAxios(api.delete(`/sessions/${session.id}`));

        removeItem("adminSession");
        navigate("/admin");
    };

    const handleStartClick = async (e) => {
        const start = await prettyAxios(
            api.post(`/sessions/start/${session.id}`)
        );
        if (start.isError) {
            return alert(start.data.message);
        }
        const _session = await prettyAxios(api.get(`/sessions/${session.id}`));
        if (_session.isError) {
            return alert(_session.data.message);
        }
        setItem("adminSession", _session.data.data);
        setSession(_session.data.data);
    };

    const handleFinishClick = async (e) => {
        const finish = await prettyAxios(
            api.post(`/sessions/finish_question/${session.id}`)
        );
        if (finish.isError) {
            return alert(finish.data.message);
        }
        const _session = await prettyAxios(api.get(`/sessions/${session.id}`));
        if (_session.isError) {
            return alert(_session.data.message);
        }
        setItem("adminSession", _session.data.data);
        setSession(_session.data.data);
    };

    const handleNextClick = async (e) => {
        const next = await prettyAxios(
            api.post(`/sessions/next_question/${session.id}`)
        );
        if (next.isError) {
            return alert(next.data.message);
        }
        const _session = await prettyAxios(api.get(`/sessions/${session.id}`));
        if (_session.isError) {
            return alert(_session.data.message);
        }
        setItem("adminSession", _session.data.data);
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
            setItem("adminSession", _session.data.data);
            setSession(_session.data.data);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!session) {
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
                    <p>Status: {session.status}</p>
                </div>
                <button
                    type="button"
                    className="underline text-red-500"
                    onClick={handleDeleteRoomClick}
                >
                    ลบห้อง
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

                    <button
                        type="button"
                        className="underline"
                        onClick={handleStartClick}
                    >
                        เริ่มเกมเลย
                    </button>
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

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {session.category.questions[
                            session.currentQuestionIndex
                        ].choices.map((c, idx) => (
                            <div
                                key={idx}
                                className={`border border-black/20 p-6 ${
                                    session.choiceStatus === "SUCCESS" &&
                                    c.correct
                                        ? "bg-green-200"
                                        : ""
                                }`}
                            >
                                <h1 className="text-xl">{c.title}</h1>
                                {session.choiceStatus === "SUCCESS" && (
                                    <p className="text-black/40">
                                        มีคนตอบข้อนี้{" "}
                                        {
                                            session.users.filter(
                                                (user) =>
                                                    !!user.answers.find(
                                                        (a) =>
                                                            a.questionIndex ===
                                                                session.currentQuestionIndex &&
                                                            a.choiceIndex ===
                                                                idx
                                                    )
                                            ).length
                                        }{" "}
                                        คน
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                    <h1 className="text-xl">
                        มีคนตอบคำถามแล้ว{" "}
                        {
                            session.users.filter(
                                (u) =>
                                    !!u.answers.find(
                                        (a) =>
                                            a.questionIndex ===
                                            session.currentQuestionIndex
                                    )
                            ).length
                        }
                        /{session.users.length} คน
                    </h1>
                    {session.choiceStatus === "PLAYING" && (
                        <button
                            type="button"
                            className="underline"
                            onClick={handleFinishClick}
                        >
                            เฉลยเลย
                        </button>
                    )}
                    {session.choiceStatus === "SUCCESS" && (
                        <button
                            type="button"
                            className="underline"
                            onClick={handleNextClick}
                        >
                            ไปยังข้อถัดไป
                        </button>
                    )}
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