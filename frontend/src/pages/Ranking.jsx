import {
    useEffect,
    useState
} from "react";

import {
    Container,
    Table,
    Spinner,
    Alert,
    Form
} from "react-bootstrap";

import api from "../services/api";


function Ranking() {

    var [
        ranking,
        setRanking
    ] = useState([]);


    var [
        rodada,
        setRodada
    ] = useState("geral");


    var [
        carregando,
        setCarregando
    ] = useState(true);


    useEffect(

        function() {

            carregarRanking();

        },

        [rodada]

    );


    async function carregarRanking() {

        setCarregando(true);

        try {

            var params = {};

            if (rodada !== "geral") {

                params.rodada = rodada;

            }


            var resposta =
                await api.get(
                    "/ranking/",
                    { params: params }
                );


            setRanking(
                resposta.data
            );


        } catch (error) {

            console.error(
                error
            );

        } finally {

            setCarregando(
                false
            );

        }

    }


    return (

        <Container
            className="py-4"
        >

            <div
                className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2"
            >

                <h1
                    className="m-0"
                >

                    🏆 Ranking

                </h1>


                {/* Seletor de Rodadas */}
                <Form.Group
                    className="d-flex align-items-center gap-2"
                >

                    <Form.Label
                        className="m-0 fw-bold"
                    >

                        Rodada:

                    </Form.Label>


                    <Form.Select

                        value={rodada}

                        onChange={
                            function(e) {
                                setRodada(e.target.value);
                            }
                        }

                        style={{ width: "180px" }}

                    >

                        <option value="geral">
                            Geral (Acumulado)
                        </option>

                        {Array.from({ length: 38 }, function(_, index) {

                            var numRodada = index + 1;

                            return (

                                <option
                                    key={numRodada}
                                    value={numRodada}
                                >

                                    Rodada {numRodada}

                                </option>

                            );

                        })}

                    </Form.Select>

                </Form.Group>

            </div>


            {carregando ? (

                <div
                    className="text-center py-5"
                >

                    <Spinner />

                </div>

            ) : ranking.length === 0 ? (

                <Alert
                    variant="info"
                >

                    Ainda não existem participantes ou palpites registrados nesta seleção.

                </Alert>

            ) : (

                <Table

                    striped

                    bordered

                    hover

                    responsive

                >

                    <thead>

                        <tr>

                            <th>
                                Posição
                            </th>

                            <th>
                                Nome
                            </th>

                            <th>
                                Pontos
                            </th>

                            <th>
                                Craque da Rodada
                            </th>

                            <th>
                                Acertos Simples
                            </th>

                            <th>
                                Total de Palpites
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {ranking.map(

                            function(item) {

                                return (

                                    <tr
                                        key={
                                            item.usuario_id
                                        }
                                    >

                                        <td>

                                            {
                                                item.posicao
                                            }

                                        </td>


                                        <td>

                                            {
                                                item.nome
                                            }

                                        </td>


                                        <td>

                                            <strong>

                                                {
                                                    item.pontos_totais
                                                }

                                            </strong>

                                        </td>


                                        <td>

                                            {
                                                item.acertos_exatos
                                            }

                                        </td>


                                        <td>

                                            {
                                                item.acertos_simples
                                            }

                                        </td>


                                        <td>

                                            {
                                                item.total_palpites
                                            }

                                        </td>

                                    </tr>

                                );

                            }

                        )}

                    </tbody>

                </Table>

            )}

        </Container>

    );

}


export default Ranking;