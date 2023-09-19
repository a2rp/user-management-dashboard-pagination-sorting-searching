import Edit from "./pages/edit";
import Home from "./pages/home";
import Login from "./pages/login";
import Delete from "./pages/delete";

import styles from "./styles.module.scss";
import { NavLink, Route, Routes } from "react-router-dom";

function App() {
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/edit" element={<Edit />} />
                    <Route path="/delete" element={<Delete />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
