import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import useDeleteUser from '../../hooks/useDeleteUser';
import DisplayPaginatedData from './DisplayPaginatedData';

const DisplayAllUsers = () => {
    const navigate = useNavigate(null);
    const [userEmail, setUserEmail] = useState(window.localStorage.getItem("email") || "");
    const [role, setRole] = useState("");
    const [name, setName] = useState("");

    const [allUsers, setAllUsers] = useState([]);
    const [tempUsers, setTempUsers] = useState([]);
    const getAllUsers = (event) => {
        axios.get("http://localhost:1198/api/v1/user-all").then(response => {
            // console.log(response.data);
            setAllUsers(response.data);
            setTempUsers(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    useEffect(() => {
        console.log(allUsers);
        // console.log(userEmail);
    }, [allUsers]);

    useEffect(() => {
        if (userEmail.length === 0) {
            return navigate("/login");
        } else {
            getUser();
            getAllUsers();
        }
    }, [userEmail]);

    // search
    const [search, setSearch] = useState("");
    const handleSearch = event => {
        setSearch(event.target.value);

        const searchText = event.target.value.toLowerCase();
        setAllUsers([]);
        let newList = tempUsers.filter(function (el) {
            console.log(el);
            return el.name.includes(searchText) ||
                el.userid.includes(searchText) ||
                el.role.includes(searchText) ||
                el.email.includes(searchText);
        });
        setAllUsers(newList);
    };

    const getUser = (event) => {
        axios.post("http://localhost:1198/api/v1/user", { email: userEmail }).then(response => {
            if (response.data.success) {
                setRole(response.data.role);
                setName(response.data.name);
            }
        }).catch(error => {
            console.error(error);
        });
    };

    // edit user
    const editUser = (email) => {
        console.log(email);
        // return <Navigate to={"/edit"} state={{ email }} />
        return navigate("/edit", { replace: true, state: { email } });
    };

    // delete user
    const deleteUser = email => {
        // console.log(email);
        return navigate("/delete", { replace: true, state: { email } });
    };

    return (
        <div>
            {window.localStorage.getItem("role") === "administrator" && <>
                <Input type="text" name="search" placeholder="search" onChange={handleSearch} value={search} marginLeft="15px" width="500px" backgroundColor="#aaa" color="#fff" />
            </>}

            {/* <TableContainer style={{ border: "3px solid #000", margin: "15px" }}>
                <Table variant="striped">
                    <Thead>
                        <Tr style={{ backgroundColor: "#000", color: "#fff", textAlign: "center" }}>
                            <Th style={{ textAlign: "center", color: "#fff" }}>User ID</Th>
                            <Th style={{ textAlign: "center", color: "#fff" }}>Name</Th>
                            <Th style={{ textAlign: "center", color: "#fff" }}>Email</Th>
                            <Th style={{ textAlign: "center", color: "#fff" }}>Role</Th>
                            <Th style={{ textAlign: "center", color: "#fff" }}>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allUsers && Object.keys(allUsers).map((item, index) => (
                            <Tr key={index} style={{ textAlign: "center" }}>
                                <Td style={{ textAlign: "center" }}>{allUsers[item].userid}</Td>
                                <Td style={{ textAlign: "center" }}>{allUsers[item].name}</Td>
                                <Td style={{ textAlign: "center" }}>{allUsers[item].email}</Td>
                                <Td style={{ textAlign: "center" }}>{allUsers[item].role}</Td>
                                <Td style={{ textAlign: "center" }}>
                                    {allUsers[item].email !== userEmail
                                        ? <>
                                            {window.localStorage.getItem("role") === "administrator" || window.localStorage.getItem("role") === "editor"
                                                ? <Button
                                                    mt={4}
                                                    colorScheme="teal"
                                                    onClick={() => editUser(allUsers[item].email)}
                                                >
                                                    Edit
                                                    {/* {allUsers[item].email} */}
            {/* </Button>
                                                : ""}

                                            {window.localStorage.getItem("role") === "administrator"
                                                ?
                                                <Button
                                                    mt={4}
                                                    colorScheme="red"
                                                    marginLeft="15px"
                                                    onClick={() => deleteUser(allUsers[item].email)}
                                                >
                                                    Delete */}
            {/* {allUsers[item].email} */}
            {/* </Button>
                                                : ""}
                                        </>
                                        : ""}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer> */}

            <DisplayPaginatedData jsonData={JSON.parse(JSON.stringify(allUsers))} userEmail={userEmail} />
        </div >
    )
}

export default DisplayAllUsers

