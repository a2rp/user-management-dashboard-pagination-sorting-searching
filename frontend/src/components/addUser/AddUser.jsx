import { Button, FormControl, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import api from "../../api";

const AddUser = () => {
    const navigate = useNavigate(null);
    useEffect(() => {
        if (window.localStorage.getItem("role") !== "administrator") {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    // add user
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        password_confirm: "",
        role: ""
    });
    const [response, setResponse] = useState("");
    const handleInputsChange = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    };
    const handleAddUserSubmit = (event) => {
        event.preventDefault();

        if (inputs.role === "") {
            setResponse("role not selected");
            return;
        }

        setIsSubmitting(true);
        setResponse("");
        api.post("/user-add", inputs).then(({ data }) => {
            if (data.success) {
                window.location.reload();
            }
            setResponse(data.message);
        }).catch(error => {
            setResponse(error.response?.data?.message || "Could not add this user.");
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const handleRoleChange = event => {
        setInputs({ ...inputs, role: event.target.value });
    };

    return (
        <div>
            <Text fontSize="20px" color="tomato" marginLeft="15px">
                Add User
            </Text>
            <form onSubmit={handleAddUserSubmit} >
                <FormControl margin="15px" width="900px">
                    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                        <div style={{ width: "50%" }}>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input type="text" id="name" name="name" maxLength={100} onChange={handleInputsChange} required value={inputs.name} placeholder="name" />
                        </div>
                        <div style={{ width: "50%" }}>
                            <FormLabel htmlFor="email">Email address</FormLabel>
                            <Input type="email" id="email" name="email" onChange={handleInputsChange} required value={inputs.email} placeholder="email" />
                        </div>

                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                        <div style={{ width: "50%" }}>
                            <FormLabel htmlFor="password" marginTop="30px">Password</FormLabel>
                            <Input type="password" id="password" name="password" minLength={12} maxLength={72} autoComplete="new-password" placeholder="At least 12 characters" onChange={handleInputsChange} required value={inputs.password} />
                        </div>
                        <div style={{ width: "50%" }}>
                            <FormLabel htmlFor="password_confirm" marginTop="30px">Password Confirm</FormLabel>
                            <Input type="password" id="password_confirm" name="password_confirm" minLength={12} maxLength={72} autoComplete="new-password" placeholder="Confirm password" onChange={handleInputsChange} required value={inputs.password_confirm} />
                        </div>
                    </div>

                    <Select placeholder="Select option" onChange={handleRoleChange} value={inputs.role} marginTop="30px" required>
                        <option value="administrator">administrator</option>
                        <option value="viewer">viewer</option>
                        <option value="editor">editor</option>
                    </Select>

                    <label style={{ display: "block", marginTop: "30px" }}>{response}</label>

                    <Button
                        mt={4}
                        marginTop="50px"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Submit
                    </Button>
                    <Button
                        mt={4}
                        marginTop="50px"
                        colorScheme="red"
                        type="button"
                        onClick={() => {
                            window.location.reload();
                        }}
                        marginLeft="15px"
                    >
                        Cancel
                    </Button>
                </FormControl>
            </form>
        </div >
    )
}

export default AddUser
