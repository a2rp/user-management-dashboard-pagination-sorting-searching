import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";

const Delete = () => {
    const { state } = useLocation();
    const email = state?.email;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(Boolean(email));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const cancelRef = useRef();

    useEffect(() => {
        if (!email) navigate("/home", { replace: true });
    }, [email, navigate]);

    const onClose = () => {
        setIsOpen(false);
        navigate("/home", { replace: true });
    };

    const deleteUser = async () => {
        setIsSubmitting(true);
        setErrorMessage("");
        try {
            await api.delete(`/user-delete/${encodeURIComponent(email)}`);
            navigate("/home", { replace: true });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Could not delete this user.");
            setIsSubmitting(false);
        }
    };

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete User</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to delete {email}? This action cannot be undone.
                        {errorMessage && <Text role="alert" color="red.500" mt={3}>{errorMessage}</Text>}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} isDisabled={isSubmitting}>Cancel</Button>
                        <Button colorScheme="red" onClick={deleteUser} ml={3} isLoading={isSubmitting}>
                            Delete user
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default Delete;
