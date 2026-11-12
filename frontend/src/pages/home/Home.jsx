import React, { useState } from "react";
import Header from "../../components/header/Header";
import { Button } from "@chakra-ui/react";
import styles from "./styles.module.scss";
import AddUser from "../../components/addUser/AddUser";
import DisplayAllUsers from "../../components/displayAllUsers/DisplayAllUsers";

const Home = () => {
    const [section, setSection] = useState("users");
    const role = window.localStorage.getItem("role");

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.contentContainer}>
                {role === "administrator" && (
                    <Button colorScheme="blue" onClick={() => setSection("add-user")}>Add User</Button>
                )}
                {role && (
                    <Button
                        colorScheme="blue"
                        marginLeft={role === "administrator" ? "15px" : undefined}
                        onClick={() => setSection("users")}
                    >
                        User directory
                    </Button>
                )}
            </div>
            {section === "add-user" && role === "administrator" ? <AddUser /> : <DisplayAllUsers />}
        </div>
    );
};

export default Home;
