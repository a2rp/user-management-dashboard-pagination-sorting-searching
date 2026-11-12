import { Input, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import DisplayPaginatedData from "./DisplayPaginatedData";

const DisplayAllUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [role, setRole] = useState("");
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let active = true;

        const loadUsers = async () => {
            try {
                const { data: session } = await api.get("/session");
                if (!active) return;

                setUserEmail(session.user.email);
                setRole(session.user.role);
                window.localStorage.setItem("email", session.user.email);
                window.localStorage.setItem("role", session.user.role);

                const { data: userList } = await api.get("/user-all");
                if (active) setUsers(userList);
            } catch (error) {
                if (!active) return;
                if (error.response?.status === 401 || error.response?.status === 403) {
                    window.localStorage.removeItem("email");
                    window.localStorage.removeItem("role");
                    navigate("/login", { replace: true });
                    return;
                }
                setErrorMessage(error.response?.data?.message || "Could not load users. Check that the API is running.");
            } finally {
                if (active) setIsLoading(false);
            }
        };

        loadUsers();
        return () => { active = false; };
    }, [navigate]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) =>
            [user.name, user.userid, user.role, user.email]
                .some((value) => String(value || "").toLowerCase().includes(query))
        );
    }, [search, users]);

    return (
        <div>
            <Input
                type="search"
                name="search"
                placeholder="Search users"
                onChange={(event) => setSearch(event.target.value)}
                value={search}
                marginLeft="15px"
                width="min(500px, calc(100% - 30px))"
                aria-label="Search users"
            />

            {errorMessage && <Text role="alert" color="red.500" margin="15px">{errorMessage}</Text>}
            {isLoading ? <Text margin="15px" aria-live="polite">Loading users…</Text> : (
                <DisplayPaginatedData jsonData={filteredUsers} userEmail={userEmail} role={role} />
            )}
        </div>
    );
};

export default DisplayAllUsers;
