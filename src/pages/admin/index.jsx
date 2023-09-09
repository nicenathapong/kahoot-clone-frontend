import { useEffect, useState } from "react";
import { prettyAxios } from "../../utils/promise";
import { api } from "../../libs/axios";
import { useNavigate } from "react-router-dom";
import { setItem } from "../../libs/localStorage";

export default function AdminPage() {
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    const handleCreateRoomClick = async (e, idx) => {
        e.preventDefault();

        const create = await prettyAxios(
            api.post("/sessions", {
                questionIndex: idx,
                name: "Room",
            })
        );

        if (create.isError) {
            return alert(create.data.message);
        }

        setItem("adminSession", create.data.data);
        navigate("/admin/play");
    };

    async function loadCategories() {
        const _categories = await prettyAxios(api.get("/categories"));
        if (_categories.isError) {
            return alert(_categories.data.message);
        }
        setCategories(_categories.data.data);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <>
            <div className="p-8 flex flex-wrap gap-4">
                {categories.map((c, idx) => (
                    <div key={idx} className="border border-black/20 p-4">
                        <h1 className="text-xl font-bold">{c.name}</h1>
                        <p className="text-black/40 mb-4">
                            จำนวน {c.questions.length} ข้อ
                        </p>
                        <button
                            type="button"
                            className="underline"
                            onClick={(e) => handleCreateRoomClick(e, idx)}
                        >
                            สร้างห้อง
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
