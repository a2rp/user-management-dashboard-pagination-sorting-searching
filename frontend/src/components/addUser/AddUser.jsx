import { Button, FormControl, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const AddUser = () => {
    const navigate = useNavigate(null);
    useEffect(() => {
        if (window.localStorage.getItem("role") !== "administrator") {
            navigate("/home");
        }
    }, []);

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

        setResponse(false);
        let emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;;
        const emailTestValue = function validateEmail(email) {
            return emailRegex.test(email);
        }
        // console.log(emailTestValue(inputs.email), "emailTestValue");
        if (!emailTestValue(inputs.email)) {
            setResponse("Invalid Email");
            return;
        }

        if (inputs.password.trim().length < 8) {
            setResponse("Password length minimum 8 required");
            return;
        }

        console.log(inputs);
        if (inputs.role === "") {
            setResponse("role not selected");
            return;
        }

        setIsSubmitting(true);
        setResponse("");
        axios.post(`http://localhost:1198/api/v1/user-add`, inputs).then(response => {
            console.log(response);
            if (response.data.success) {
                window.location.reload();
            }
            setResponse(response.data.message);
        }).catch(error => {
            console.log(error);
            setResponse(error.message);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const [selected, setSelected] = useState();
    const handleRoleChange = event => {
        console.log(event.target.value);
        setSelected(event.target.value);
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
                            <Input type="name" id="name" name="name" onChange={handleInputsChange} required value={inputs.name} placeholder="name" />
                        </div>
                        <div style={{ width: "50%" }}>
                            <FormLabel htmlFor="email">Email address</FormLabel>
                            <Input type="email" id="email" name="email" onChange={handleInputsChange} required value={inputs.email} placeholder="email" />
                        </div>

                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                        <div style={{ width: "50%" }}>
                            <FormLabel htmlFor="password" marginTop="30px">Password</FormLabel>
                            <Input type="password" id="password" name="password" placeholder="Password" onChange={handleInputsChange} required value={inputs.password} />
                        </div>
                        <div style={{ width: "50%" }}>
                            <FormLabel htmlFor="password_confirm" marginTop="30px">Password Confirm</FormLabel>
                            <Input type="password" id="password_confirm" name="password_confirm" placeholder="Password Confirm" onChange={handleInputsChange} required value={inputs.password_confirm} />
                        </div>
                    </div>

                    <Select placeholder="Select option" onChange={handleRoleChange} value={selected} marginTop="30px">
                        <option value="administrator">administrator</option>
                        <option value="viewer">viewer</option>
                        <option value="editor">editor</option>
                    </Select>

                    <label style={{ display: "block", marginTop: "30px", color: "orangered" }}>{response}</label>

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
