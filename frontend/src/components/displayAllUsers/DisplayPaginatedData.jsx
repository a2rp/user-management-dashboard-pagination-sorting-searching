import React, { useState } from 'react'
import styles from "./styles.module.scss";
import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TbCaretUpDown } from "react-icons/tb";

const DisplayPaginatedData = ({ jsonData, userEmail }) => {
    // console.log(jsonData);
    const navigate = useNavigate(null);

    const Data = jsonData;
    console.log(Data, "data");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = Data.slice(firstIndex, lastIndex);
    const nPage = Math.ceil(Data.length / recordsPerPage);
    const numbers = [...Array(nPage + 1).keys()].slice(1);

    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changeCurrentPage = (id) => {
        setCurrentPage(id);
    };

    const nextPage = () => {
        if (currentPage !== nPage) {
            setCurrentPage(currentPage + 1);
        }
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

    const [idSort, setIdSort] = useState(false);
    const sortById = () => {
        if (idSort === true) {
            Data.sort((a, b) => (a.id > b.id) ? 1 : -1);
            setIdSort(false);
        } else if (idSort === false) {
            Data.sort((a, b) => (a.id < b.id) ? 1 : -1);
            setIdSort(true);
        }
    };

    const [nameSort, setNameSort] = useState(false);
    const sortByName = () => {
        if (nameSort === true) {
            Data.sort((a, b) => (a.name > b.name) ? 1 : -1);
            setNameSort(false);
        } else if (nameSort === false) {
            Data.sort((a, b) => (a.name < b.name) ? 1 : -1);
            setNameSort(true);
        }
    };

    const [emailSort, setEmailSort] = useState(false);
    const sortByEmail = () => {
        if (emailSort === true) {
            Data.sort((a, b) => (a.email > b.email) ? 1 : -1);
            setEmailSort(false);
        } else if (emailSort === false) {
            Data.sort((a, b) => (a.email < b.email) ? 1 : -1);
            setEmailSort(true);
        }
    };

    const [roleSort, setRoleSort] = useState(false);
    const sortByRole = () => {
        if (roleSort === true) {
            Data.sort((a, b) => (a.role > b.role) ? 1 : -1);
            setRoleSort(false);
        } else if (roleSort === false) {
            Data.sort((a, b) => (a.role < b.role) ? 1 : -1);
            setRoleSort(true);
        }
    };

    return (
        <div className={styles.container}>
            <TableContainer className={styles.tableContainer}>
                <Table variant="striped" className={styles.table}>
                    <Thead className={styles.thead}>
                        <Tr className={styles.tr}>
                            <Th className={styles.th}>
                                USER ID <TbCaretUpDown style={{ color: "#fff", float: "right", fontSize: "20px" }} onClick={sortById} />
                            </Th>
                            <Th className={styles.th}>
                                NAME <TbCaretUpDown style={{ color: "#fff", float: "right", fontSize: "20px" }} onClick={sortByName} />
                            </Th>
                            <Th className={styles.th}>
                                EMAIL <TbCaretUpDown style={{ color: "#fff", float: "right", fontSize: "20px" }} onClick={sortByEmail} />
                            </Th>
                            <Th className={styles.th}>
                                ROLE <TbCaretUpDown style={{ color: "#fff", float: "right", fontSize: "20px" }} onClick={sortByRole} />
                            </Th>
                            <Th className={styles.th}>
                                ACTIONS
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody className={styles.tbody}>
                        {records.map((data, index) => (
                            <Tr key={index} className={styles.tr}>
                                <Td className={styles.td}>{data.userid}</Td>
                                <Td className={styles.td}>{data.name}</Td>
                                <Td className={styles.td}>{data.email}</Td>
                                <Td className={styles.td}>{data.role}</Td>
                                <Td className={styles.td}>
                                    {data.email !== userEmail
                                        ? <>
                                            {window.localStorage.getItem("role") === "administrator"
                                                ? <Button
                                                    // mt={4}
                                                    colorScheme="teal"
                                                    onClick={() => editUser(data.email)}
                                                >
                                                    Edit
                                                    {/* {data.email} */}
                                                </Button>
                                                : ""}

                                            {window.localStorage.getItem("role") === "administrator"
                                                ?
                                                <Button
                                                    // mt={4}
                                                    colorScheme="red"
                                                    marginLeft="15px"
                                                    onClick={() => deleteUser(data.email)}
                                                >
                                                    Delete
                                                    {/* {data.email} */}
                                                </Button>
                                                : ""}
                                        </>
                                        : ""}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <nav className={styles.nav}>
                <ul>
                    <li>
                        <a href="#" onClick={previousPage} className={styles.previous}>previous</a>
                    </li>
                    {
                        numbers && numbers.map((number, index) => (
                            <li key={index} style={{ backgroundColor: currentPage === number ? "#000" : "", color: currentPage === number ? "#fff" : "" }}>
                                <a href="#" onClick={() => changeCurrentPage(number)}>{number}</a>
                            </li>
                        ))
                    }
                    <li>
                        <a href="#" onClick={nextPage}>next</a>
                    </li>
                </ul>
            </nav>
        </div >
    )
}

export default DisplayPaginatedData;
