import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { TbCaretUpDown } from "react-icons/tb";
import styles from "./styles.module.scss";

const RECORDS_PER_PAGE = 3;

const DisplayPaginatedData = ({ jsonData, userEmail, role }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("userid");
    const [sortDirection, setSortDirection] = useState("ascending");
    const canEdit = role === "administrator" || role === "editor";
    const canDelete = role === "administrator";

    const sortedData = useMemo(() => {
        const direction = sortDirection === "ascending" ? 1 : -1;
        return [...jsonData].sort((left, right) => {
            const leftValue = String(left[sortBy] ?? "");
            const rightValue = String(right[sortBy] ?? "");
            const comparison = leftValue.localeCompare(rightValue, undefined, {
                numeric: sortBy === "userid",
                sensitivity: "base",
            });
            return comparison === 0
                ? left.email.localeCompare(right.email, undefined, { sensitivity: "base" })
                : comparison * direction;
        });
    }, [jsonData, sortBy, sortDirection]);

    const pageCount = Math.ceil(sortedData.length / RECORDS_PER_PAGE);
    const visiblePage = pageCount ? Math.min(currentPage, pageCount) : 1;
    const firstIndex = (visiblePage - 1) * RECORDS_PER_PAGE;
    const records = sortedData.slice(firstIndex, firstIndex + RECORDS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [jsonData, sortBy, sortDirection]);

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortDirection((current) => current === "ascending" ? "descending" : "ascending");
        } else {
            setSortBy(field);
            setSortDirection("ascending");
        }
    };

    const sortHeader = (field, label) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            width="100%"
            justifyContent="space-between"
            color="white"
            _hover={{ backgroundColor: "whiteAlpha.200" }}
            onClick={() => toggleSort(field)}
            aria-label={`Sort by ${label} ${sortBy === field && sortDirection === "ascending" ? "descending" : "ascending"}`}
        >
            {label}<TbCaretUpDown aria-hidden="true" />
        </Button>
    );

    const editUser = (email) => navigate("/edit", { replace: true, state: { email } });
    const deleteUser = (email) => navigate("/delete", { replace: true, state: { email } });

    return (
        <div className={styles.container}>
            <TableContainer className={styles.tableContainer}>
                <Table variant="striped" className={styles.table}>
                    <Thead className={styles.thead}>
                        <Tr className={styles.tr}>
                            <Th className={styles.th} aria-sort={sortBy === "userid" ? sortDirection : "none"}>{sortHeader("userid", "User ID")}</Th>
                            <Th className={styles.th} aria-sort={sortBy === "name" ? sortDirection : "none"}>{sortHeader("name", "Name")}</Th>
                            <Th className={styles.th} aria-sort={sortBy === "email" ? sortDirection : "none"}>{sortHeader("email", "Email")}</Th>
                            <Th className={styles.th} aria-sort={sortBy === "role" ? sortDirection : "none"}>{sortHeader("role", "Role")}</Th>
                            <Th className={styles.th}>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody className={styles.tbody}>
                        {records.map((user) => (
                            <Tr key={user.userid || user.email} className={styles.tr}>
                                <Td className={styles.td}>{user.userid}</Td>
                                <Td className={styles.td}>{user.name}</Td>
                                <Td className={styles.td}>{user.email}</Td>
                                <Td className={styles.td}>{user.role}</Td>
                                <Td className={styles.td}>
                                    {user.email !== userEmail && canEdit && (
                                        <Button size="sm" colorScheme="teal" onClick={() => editUser(user.email)}>Edit</Button>
                                    )}
                                    {user.email !== userEmail && canDelete && (
                                        <Button size="sm" colorScheme="red" marginLeft="8px" onClick={() => deleteUser(user.email)}>Delete</Button>
                                    )}
                                </Td>
                            </Tr>
                        ))}
                        {records.length === 0 && (
                            <Tr><Td colSpan={5} textAlign="center">No users match this search.</Td></Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>

            <nav className={styles.nav} aria-label="User list pages">
                <span aria-live="polite">
                    {sortedData.length === 0 ? "0 users" : `Showing ${firstIndex + 1}–${firstIndex + records.length} of ${sortedData.length}`}
                </span>
                <div className={styles.paginationControls}>
                    <Button size="sm" variant="outline" onClick={() => setCurrentPage((page) => page - 1)} isDisabled={visiblePage <= 1}>
                        Previous
                    </Button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                        <Button
                            key={page}
                            size="sm"
                            variant={page === visiblePage ? "solid" : "outline"}
                            colorScheme={page === visiblePage ? "teal" : "gray"}
                            onClick={() => setCurrentPage(page)}
                            aria-current={page === visiblePage ? "page" : undefined}
                            aria-label={`Page ${page}`}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setCurrentPage((page) => page + 1)} isDisabled={visiblePage >= pageCount}>
                        Next
                    </Button>
                </div>
            </nav>
        </div>
    );
};

export default DisplayPaginatedData;
