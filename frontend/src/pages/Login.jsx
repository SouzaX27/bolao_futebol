import {
    useState
} from "react";

import {
    Container,
    Card,
    Form,
    Button,
    Alert
} from "react-bootstrap";

import {
    useNavigate
} from "react-router-dom";

import api from "../services/api";


function Login() {

    var navigate = useNavigate();


    var [
        nome,
        setNome
    ] = useState("");


    var [
        erro,
        setErro
    ] = useState("");


    async function entrar(event) {

        event.preventDefault();

        setErro("");


        if (!nome.trim()) {

            setErro(
                "Digite seu nome ou nickname."
            );

            return;

        }


        try {

            var resposta = await api.post(

                "/usuarios/login/",

                {
                    nome:
                        nome.trim()
                }

            );


            localStorage.setItem(

                "usuario",

                JSON.stringify(
                    resposta.data.usuario
                )

            );


            navigate(
                "/palpites"
            );


        } catch (error) {

            setErro(
                "Não foi possível entrar."
            );

        }

    }


    return (

        <Container
            className="
                d-flex
                justify-content-center
                align-items-center
            "
            style={{
                minHeight:
                    "80vh"
            }}
        >

            <Card
                className="shadow"
                style={{
                    width:
                        "100%",
                    maxWidth:
                        "400px"
                }}
            >

                <Card.Body>

                    <Card.Title>

                        ⚽ Bolão
                        Brasileirão

                    </Card.Title>


                    <Card.Text>

                        Informe seu nome
                        ou nickname.

                    </Card.Text>


                    {erro && (

                        <Alert
                            variant="danger"
                        >

                            {erro}

                        </Alert>

                    )}


                    <Form
                        onSubmit={
                            entrar
                        }
                    >

                        <Form.Group
                            className="mb-3"
                        >

                            <Form.Label>

                                Nome / Nickname

                            </Form.Label>


                            <Form.Control

                                type="text"

                                value={
                                    nome
                                }

                                onChange={
                                    function(event) {

                                        setNome(
                                            event.target.value
                                        );

                                    }
                                }

                                placeholder="
                                    Ex: Gustavo
                                "

                            />

                        </Form.Group>


                        <Button
                            type="submit"
                            className="w-100"
                        >

                            Entrar

                        </Button>

                    </Form>

                </Card.Body>

            </Card>

        </Container>

    );

}


export default Login;