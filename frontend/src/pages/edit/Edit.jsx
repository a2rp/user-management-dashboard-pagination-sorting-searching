import { Button, FormControl, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import api from "../../api";

const EditUser = () => {
    const { state } = useLocation();
    const email = state?.email;
    const navigate = useNavigate();
    const isAdministrator = window.localStorage.getItem("role") === "administrator";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [response, setResponse] = useState("");
    const [inputs, setInputs] = useState({ name: "", email: email || "", role: "" });

    useEffect(() => {
        let active = true;
        if (!email) {
            navigate("/home", { replace: true });
            return () => { active = false; };
        }

        api.post("/user", { email })
            .then(({ data }) => {
                if (active) setInputs({ name: data.name, email: data.email, role: data.role });
            })
            .catch((error) => {
                if (active) setResponse(error.response?.data?.message || "Could not load this user.");
            });

        return () => { active = false; };
    }, [email, navigate]);

    const handleInputsChange = (event) => {
        setInputs((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleUpdateUserSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResponse("");
        try {
            const { data } = await api.patch("/user-update", inputs);
            if (data.success) navigate("/home", { replace: true });
        } catch (error) {
            setResponse(error.response?.data?.message || "Could not update this user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Header />
            <Text fontSize="20px" color="tomato" marginLeft="15px">Update User</Text>
            <form onSubmit={handleUpdateUserSubmit}>
                <FormControl margin="15px" width="300px">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        maxLength={100}
                        onChange={handleInputsChange}
                        required
                        value={inputs.name}
                        placeholder="Name"
                    />

                    <FormLabel htmlFor="role" marginTop="30px">Role</FormLabel>
                    <Select
                        id="role"
                        name="role"
                        onChange={handleInputsChange}
                        value={inputs.role}
                        isDisabled={!isAdministrator}
                    >
                        <option value="administrator">administrator</option>
                        <option value="viewer">viewer</option>
                        <option value="editor">editor</option>
                    </Select>
                    {!isAdministrator && <Text fontSize="sm" mt={2}>Only administrators can change roles.</Text>}

                    {response && <Text role="alert" color="red.500" mt={3}>{response}</Text>}

                    <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                        Save changes
                    </Button>
                    <Button mt={4} colorScheme="red" type="button" onClick={() => navigate("/home")} marginLeft="15px">
                        Cancel
                    </Button>
                </FormControl>
            </form>
        </div>
    );
};

export default EditUser;
