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
    Alert,
    Spinner
} from "react-bootstrap";

import api from "../services/api";


function Palpites() {

    var usuario = JSON.parse(
        localStorage.getItem(
            "usuario"
        )
    );


    var [
        rodada,
        setRodada
    ] = useState(1);


    var [
        jogos,
        setJogos
    ] = useState([]);


    var [
        palpites,
        setPalpites
    ] = useState({});


    var [
        mensagem,
        setMensagem
    ] = useState("");


    var [
        carregando,
        setCarregando
    ] = useState(false);


    useEffect(

        function() {

            carregarDados();

        },

        [rodada]

    );


    async function carregarDados() {

        setCarregando(
            true
        );


        try {

            var respostaJogos =
                await api.get(

                    "/jogos/",

                    {
                        params: {
                            rodada:
                                rodada
                        }
                    }

                );


            var respostaPalpites =
                await api.get(

                    "/palpites/",

                    {
                        params: {

                            usuario_id:
                                usuario.id,

                            rodada:
                                rodada

                        }
                    }

                );


            setJogos(
                respostaJogos.data
            );


            var palpitesIniciais = {};


            respostaPalpites.data.forEach(

                function(palpite) {

                    palpitesIniciais[
                        palpite.jogo
                    ] = {

                        gols_mandante:
                            palpite.gols_mandante,

                        gols_visitante:
                            palpite.gols_visitante

                    };

                }

            );


            setPalpites(
                palpitesIniciais
            );


        } catch (error) {

            setMensagem(
                "Erro ao carregar os dados."
            );

        } finally {

            setCarregando(
                false
            );

        }

    }


    function alterarPalpite(

        jogoId,

        campo,

        valor

    ) {

        setPalpites(

            function(anterior) {

                return {

                    ...anterior,

                    [jogoId]: {

                        ...anterior[jogoId],

                        [campo]:
                            valor

                    }

                };

            }

        );

    }


    async function salvarPalpites() {

        var listaPalpites = [];


        Object.entries(
            palpites
        ).forEach(

            function([
                jogoId,
                palpite
            ]) {

                if (

                    palpite.gols_mandante ===
                    undefined

                    ||

                    palpite.gols_visitante ===
                    undefined

                    ||

                    palpite.gols_mandante ===
                    ""

                    ||

                    palpite.gols_visitante ===
                    ""

                ) {

                    return;

                }


                listaPalpites.push({

                    jogo_id:
                        Number(
                            jogoId
                        ),

                    gols_mandante:
                        Number(
                            palpite.gols_mandante
                        ),

                    gols_visitante:
                        Number(
                            palpite.gols_visitante
                        )

                });

            }

        );


        try {

            await api.post(

                "/palpites/salvar/",

                {

                    usuario_id:
                        usuario.id,

                    palpites:
                        listaPalpites

                }

            );


            setMensagem(
                "Palpites salvos com sucesso!"
            );


        } catch (error) {

            setMensagem(
                "Erro ao salvar os palpites."
            );

        }

    }


    return (

        <Container
            className="py-4"
        >

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    mb-4
                "
            >

                <div>

                    <h1>

                        Meus Palpites

                    </h1>


                    <p>

                        Olá, {usuario.nome}!

                    </p>

                </div>


                <Form.Select

                    value={
                        rodada
                    }

                    onChange={
                        function(event) {

                            setRodada(

                                Number(
                                    event.target.value
                                )

                            );

                        }
                    }

                    style={{
                        maxWidth:
                            "180px"
                    }}

                >

                    {Array.from(

                        {
                            length:
                                38
                        },

                        function(_, index) {

                            return (

                                <option

                                    key={
                                        index + 1
                                    }

                                    value={
                                        index + 1
                                    }

                                >

                                    Rodada {
                                        index + 1
                                    }

                                </option>

                            );

                        }

                    )}

                </Form.Select>

            </div>


            {mensagem && (

                <Alert
                    variant="info"
                >

                    {mensagem}

                </Alert>

            )}


            {carregando ? (

                <div
                    className="text-center"
                >

                    <Spinner />

                </div>

            ) : (

                <Row>

                    {jogos.map(

                        function(jogo) {

                            var bloqueado =
                                jogo.status !==
                                "AGENDADO";


                            return (

                                <Col

                                    xs={12}

                                    md={6}

                                    lg={4}

                                    className="mb-4"

                                    key={
                                        jogo.id
                                    }

                                >

                                    <Card
                                        className="h-100"
                                    >

                                        <Card.Body>

                                            <Card.Title
                                                className="
                                                    text-center
                                                "
                                            >

                                                {
                                                    jogo.mandante.nome
                                                }

                                                {" x "}

                                                {
                                                    jogo.visitante.nome
                                                }

                                            </Card.Title>


                                            <Card.Text
                                                className="
                                                    text-center
                                                "
                                            >

                                                {
                                                    new Date(
                                                        jogo.data_hora
                                                    ).toLocaleString(
                                                        "pt-BR"
                                                    )
                                                }

                                            </Card.Text>


                                            {bloqueado && (

                                                <Alert
                                                    variant="secondary"
                                                >

                                                    Palpites encerrados

                                                </Alert>

                                            )}


                                            <Row>

                                                <Col>

                                                    <Form.Label>

                                                        {
                                                            jogo.mandante.sigla
                                                        }

                                                    </Form.Label>


                                                    <Form.Control

                                                        type="number"

                                                        min="0"

                                                        disabled={
                                                            bloqueado
                                                        }

                                                        value={

                                                            palpites[
                                                                jogo.id
                                                            ]
                                                            ?.gols_mandante
                                                            ??
                                                            ""

                                                        }

                                                        onChange={

                                                            function(event) {

                                                                alterarPalpite(

                                                                    jogo.id,

                                                                    "gols_mandante",

                                                                    event.target.value

                                                                );

                                                            }

                                                        }

                                                    />

                                                </Col>


                                                <Col>

                                                    <Form.Label>

                                                        {
                                                            jogo.visitante.sigla
                                                        }

                                                    </Form.Label>


                                                    <Form.Control

                                                        type="number"

                                                        min="0"

                                                        disabled={
                                                            bloqueado
                                                        }

                                                        value={

                                                            palpites[
                                                                jogo.id
                                                            ]
                                                            ?.gols_visitante
                                                            ??
                                                            ""

                                                        }

                                                        onChange={

                                                            function(event) {

                                                                alterarPalpite(

                                                                    jogo.id,

                                                                    "gols_visitante",

                                                                    event.target.value

                                                                );

                                                            }

                                                        }

                                                    />

                                                </Col>

                                            </Row>

                                        </Card.Body>

                                    </Card>

                                </Col>

                            );

                        }

                    )}

                </Row>

            )}


            <Button

                variant="success"

                className="w-100"

                onClick={
                    salvarPalpites
                }

            >

                Salvar Palpites

            </Button>

        </Container>

    );

}


export default Palpites;