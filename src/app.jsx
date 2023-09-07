import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import AdminPage from "./pages/admin";
import PlayPage from "./pages/play";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </BrowserRouter>
    );
}
