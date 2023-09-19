import React, { useEffect, useState } from "react"
import Header from "../../components/header/Header"

import { Button } from "@chakra-ui/react"

import styles from "./styles.module.scss";
import AddUser from "../../components/addUser/AddUser";
import DisplayAllUsers from "../../components/displayAllUsers/DisplayAllUsers";

const Home = () => {
    // add user or display all users
    const [section, setSection] = useState({
        addUser: false,
        displayAllUsers: true
    });
    const handleAddOrDisplayUserSection = (section) => {
        if (section === "add-user") {
            setSection({
                addUser: true,
                displayAllUsers: false
            });
        } else if (section === "display-all-users") {
            setSection({
                addUser: false,
                displayAllUsers: true
            });
        } else {
            setSection({
                addUser: true,
                displayAllUsers: false
            });
        }
    };

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.contentContainer}>
                {window.localStorage.getItem("role") === "administrator"
                    ? <Button colorScheme="blue" onClick={() => handleAddOrDisplayUserSection("add-user")}>Add User</Button>
                    : ""}

                {window.localStorage.getItem("role") === "administrator" || window.localStorage.getItem("role") === "editor"
                    ? <Button colorScheme="blue" marginLeft="15px" onClick={() => handleAddOrDisplayUserSection("display-all-users")}>Display All Users</Button>
                    : ""}
            </div>

            {section.addUser === true ? <AddUser /> : ""}
            {section.displayAllUsers === true ? <DisplayAllUsers /> : ""}

        </div>
    )
}

export default Home
