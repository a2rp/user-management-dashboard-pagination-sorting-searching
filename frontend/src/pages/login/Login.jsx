import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Header from "../../components/header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, FormLabel, Heading } from "@chakra-ui/react";

import { Input } from "@chakra-ui/react"
import { Text } from '@chakra-ui/react'

const Login = () => {
    // check logged in user there or not to redirect to home page
    const navigate = useNavigate(null);
    const [userEmail, setUserEmail] = useState(window.localStorage.getItem("email") || "");
    useEffect(() => {
        if (userEmail.length > 0) {
            navigate("/home");
        }
    }, []);

    // axios response and form inputs
    const [response, setResponse] = useState("");
    const [inputs, setInputs] = useState({
        email: "", password: "",
    });
    const handleInputChange = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    };
    useEffect(() => {
        console.log(inputs);
    }, [inputs]);

    // submit login form
    const handleLoginSubmit = (event) => {
        event.preventDefault();

        const loginData = {
            email: inputs.email,
            password: inputs.password
        };
        // console.log(loginData);
        setResponse("");
        setIsSubmitting(true);
        axios.post(`http://localhost:1198/api/v1/login`, loginData).then(response => {
            console.log(response, "response");
            setResponse(response.data.message);
            if (response.data.success) {
                window.localStorage.setItem("email", response.data.email);
                window.localStorage.setItem("role", response.data.role);
                window.location.reload();
            } else {
                setIsSubmitting(false);
            }
        }).catch(err => {
            console.log(err);
            setResponse(err.message);
            setIsSubmitting(false);
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <div className={styles.container}>
            <Header />
            <Heading marginLeft="15px">Login</Heading>

            <form onSubmit={handleLoginSubmit}>
                <FormControl margin="15px" width="300px">
                    <FormLabel htmlFor="email">Email address</FormLabel>
                    <Input type="email" id="email" name="email" onChange={handleInputChange} required value={inputs.email} placeholder="email" />

                    <FormLabel htmlFor="password" marginTop="30px">Password</FormLabel>
                    <Input type="password" id="password" name="password" className={styles.password} placeholder="Password" onChange={handleInputChange} required value={inputs.password} />

                    <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Submit
                    </Button>
                </FormControl>
            </form>

            <Text fontSize='20px' color='tomato' marginLeft="15px">
                {response}
            </Text>
        </div>
    )
}

export default Login
