import {
    useEffect,
    useState
} from "react";

import {
    Container,
    Table,
    Spinner,
    Alert
} from "react-bootstrap";

import api from "../services/api";


function Ranking() {

    var [
        ranking,
        setRanking
    ] = useState([]);


    var [
        carregando,
        setCarregando
    ] = useState(true);


    useEffect(

        function() {

            carregarRanking();

        },

        []

    );


    async function carregarRanking() {

        try {

            var resposta =
                await api.get(
                    "/ranking/"
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

            <h1
                className="mb-4"
            >

                🏆 Ranking

            </h1>


            {carregando ? (

                <div
                    className="text-center"
                >

                    <Spinner />

                </div>

            ) : ranking.length === 0 ? (

                <Alert
                    variant="info"
                >

                    Ainda não existem
                    participantes.

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