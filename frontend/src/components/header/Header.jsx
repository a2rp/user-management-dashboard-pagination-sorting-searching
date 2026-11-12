import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "@chakra-ui/react";
import api from "../../api";

const Header = () => {
    const [email, setEmail] = useState("");

    useEffect(() => {
        let active = true;
        api.get("/session")
            .then(({ data }) => {
                if (active) setEmail(data.user.email);
            })
            .catch(() => {
                if (active) setEmail("");
            });
        return () => { active = false; };
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch {
            // Clear local UI state even if the API is unavailable.
        } finally {
            window.localStorage.removeItem("email");
            window.localStorage.removeItem("role");
            window.location.assign("/login");
        }
    };

    return (
        <div className={styles.container}>
            {email && <span>{email}</span>}
            {email && <Button colorScheme="red" onClick={handleLogout}>Logout</Button>}
        </div>
    );
};

export default Header;
