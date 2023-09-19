import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Delete = () => {
    const { state } = useLocation();
    const { email } = state;

    const navigate = useNavigate(null);

    const [isOpen, setIsOpen] = useState(true);
    const onClose = () => { setIsOpen(false); navigate("/home"); };
    const cancelRef = React.useRef();

    const deleteUser = () => {
        console.log("deleted", email);
        axios.delete(`http://localhost:1198/api/v1/user-delete/${email}`).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error.message);
        }).finally(() => {
            navigate("/home");
        });
    };

    return (
        <div>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={deleteUser} ml={3}>
                                Delete User
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    )
}

export default Delete
