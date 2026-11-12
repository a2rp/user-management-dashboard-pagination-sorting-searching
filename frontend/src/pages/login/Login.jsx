import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Header from "../../components/header/Header";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, FormLabel, Heading, Input, Text } from "@chakra-ui/react";

const Login = () => {
    const navigate = useNavigate();
    const [response, setResponse] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputs, setInputs] = useState({ email: "", password: "" });

    useEffect(() => {
        let active = true;
        api.get("/session")
            .then(({ data }) => {
                if (!active) return;
                window.localStorage.setItem("email", data.user.email);
                window.localStorage.setItem("role", data.user.role);
                navigate("/home", { replace: true });
            })
            .catch(() => {
                window.localStorage.removeItem("email");
                window.localStorage.removeItem("role");
            });

        return () => {
            active = false;
        };
    }, [navigate]);

    const handleInputChange = (event) => {
        setInputs((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setResponse("");
        setIsSubmitting(true);

        try {
            const { data } = await api.post("/login", inputs);
            window.localStorage.setItem("email", data.user.email);
            window.localStorage.setItem("role", data.user.role);
            setInputs({ email: "", password: "" });
            navigate("/home", { replace: true });
        } catch (error) {
            setResponse(error.response?.data?.message || "Unable to sign in. Check the API connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <Heading marginLeft="15px">Login</Heading>

            <form onSubmit={handleLoginSubmit}>
                <FormControl margin="15px" width="300px">
                    <FormLabel htmlFor="email">Email address</FormLabel>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="username"
                        onChange={handleInputChange}
                        required
                        value={inputs.email}
                        placeholder="email"
                    />

                    <FormLabel htmlFor="password" marginTop="30px">Password</FormLabel>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        className={styles.password}
                        placeholder="Password"
                        onChange={handleInputChange}
                        required
                        value={inputs.password}
                    />

                    <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                        Sign in
                    </Button>
                </FormControl>
            </form>

            <Text fontSize="20px" color="tomato" marginLeft="15px" role="alert">
                {response}
            </Text>
        </div>
    );
};

export default Login;
