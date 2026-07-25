import {
    useEffect,
    useState
} from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert
} from "react-bootstrap";

import api from "../services/api";


function Admin() {

    var [
        times,
        setTimes
    ] = useState([]);


    var [
        rodada,
        setRodada
    ] = useState(1);


    var [
        mandante,
        setMandante
    ] = useState("");


    var [
        visitante,
        setVisitante
    ] = useState("");


    var [
        dataHora,
        setDataHora
    ] = useState("");


    var [
        mensagem,
        setMensagem
    ] = useState("");


    useEffect(

        function() {

            carregarTimes();

        },

        []

    );


    async function carregarTimes() {

        try {

            var resposta =
                await api.get(
                    "/times/"
                );


            setTimes(
                resposta.data
            );


        } catch (error) {

            setMensagem(
                "Erro ao carregar times."
            );

        }

    }


    async function cadastrarJogo(
        event
    ) {

        event.preventDefault();


        if (

            !mandante

            ||

            !visitante

            ||

            !dataHora

        ) {

            setMensagem(
                "Preencha todos os campos."
            );

            return;

        }


        if (
            mandante === visitante
        ) {

            setMensagem(
                "Os times devem ser diferentes."
            );

            return;

        }


        try {

            await api.post(

                "/jogos/",

                {

                    rodada:
                        Number(
                            rodada
                        ),

                    mandante:
                        Number(
                            mandante
                        ),

                    visitante:
                        Number(
                            visitante
                        ),

                    data_hora:
                        dataHora,

                    status:
                        "AGENDADO"

                }

            );


            setMensagem(
                "Jogo cadastrado com sucesso!"
            );


            setMandante("");

            setVisitante("");

            setDataHora("");


        } catch (error) {

            setMensagem(
                "Erro ao cadastrar jogo."
            );

        }

    }


    async function recalcularPontos() {

        try {

            var resposta =
                await api.post(

                    "/admin/calcular-pontos/"

                );


            setMensagem(

                resposta.data.mensagem

                +

                " "

                +

                resposta.data.palpites_calculados

                +

                " palpites processados."

            );


        } catch (error) {

            setMensagem(
                "Erro ao recalcular pontuação."
            );

        }

    }


    return (

        <Container
            className="py-4"
        >

            <h1
                className="mb-4"
            >

                Painel Administrativo

            </h1>


            {mensagem && (

                <Alert
                    variant="info"
                >

                    {mensagem}

                </Alert>

            )}


            <Row>

                <Col
                    lg={6}
                    className="mb-4"
                >

                    <Card>

                        <Card.Body>

                            <Card.Title>

                                Cadastrar Jogo

                            </Card.Title>


                            <Form
                                onSubmit={
                                    cadastrarJogo
                                }
                            >

                                <Form.Group
                                    className="mb-3"
                                >

                                    <Form.Label>

                                        Rodada

                                    </Form.Label>


                                    <Form.Control

                                        type="number"

                                        min="1"

                                        max="38"

                                        value={
                                            rodada
                                        }

                                        onChange={

                                            function(event) {

                                                setRodada(

                                                    event.target.value

                                                );

                                            }

                                        }

                                    />

                                </Form.Group>


                                <Form.Group
                                    className="mb-3"
                                >

                                    <Form.Label>

                                        Mandante

                                    </Form.Label>


                                    <Form.Select

                                        value={
                                            mandante
                                        }

                                        onChange={

                                            function(event) {

                                                setMandante(

                                                    event.target.value

                                                );

                                            }

                                        }

                                    >

                                        <option
                                            value=""
                                        >

                                            Selecione

                                        </option>


                                        {times.map(

                                            function(time) {

                                                return (

                                                    <option

                                                        key={
                                                            time.id
                                                        }

                                                        value={
                                                            time.id
                                                        }

                                                    >

                                                        {
                                                            time.nome
                                                        }

                                                    </option>

                                                );

                                            }

                                        )}

                                    </Form.Select>

                                </Form.Group>


                                <Form.Group
                                    className="mb-3"
                                >

                                    <Form.Label>

                                        Visitante

                                    </Form.Label>


                                    <Form.Select

                                        value={
                                            visitante
                                        }

                                        onChange={

                                            function(event) {

                                                setVisitante(

                                                    event.target.value

                                                );

                                            }

                                        }

                                    >

                                        <option
                                            value=""
                                        >

                                            Selecione

                                        </option>


                                        {times.map(

                                            function(time) {

                                                return (

                                                    <option

                                                        key={
                                                            time.id
                                                        }

                                                        value={
                                                            time.id
                                                        }

                                                    >

                                                        {
                                                            time.nome
                                                        }

                                                    </option>

                                                );

                                            }

                                        )}

                                    </Form.Select>

                                </Form.Group>


                                <Form.Group
                                    className="mb-3"
                                >

                                    <Form.Label>

                                        Data e Hora

                                    </Form.Label>


                                    <Form.Control

                                        type="datetime-local"

                                        value={
                                            dataHora
                                        }

                                        onChange={

                                            function(event) {

                                                setDataHora(

                                                    event.target.value

                                                );

                                            }

                                        }

                                    />

                                </Form.Group>


                                <Button
                                    type="submit"
                                >

                                    Cadastrar Jogo

                                </Button>

                            </Form>

                        </Card.Body>

                    </Card>

                </Col>


                <Col
                    lg={6}
                >

                    <Card>

                        <Card.Body>

                            <Card.Title>

                                Pontuação

                            </Card.Title>


                            <Card.Text>

                                Depois de inserir os
                                resultados reais e marcar
                                os jogos como finalizados,
                                recalcule a pontuação.

                            </Card.Text>


                            <Button

                                variant="danger"

                                onClick={
                                    recalcularPontos
                                }

                            >

                                Recalcular Pontuação

                            </Button>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>

    );

}


export default Admin;