import { useEffect, useState } from "react";
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
  var usuario = JSON.parse(localStorage.getItem("usuario"));

  var [rodada, setRodada] = useState(1);
  var [jogos, setJogos] = useState([]);
  var [palpites, setPalpites] = useState({});
  var [mensagem, setMensagem] = useState("");
  var [carregando, setCarregando] = useState(false);

  useEffect(
    function () {
      carregarDados();
    },
    [rodada]
  );

  async function carregarDados() {
    setCarregando(true);

    try {
      var respostaJogos = await api.get("/jogos/", {
        params: {
          rodada: rodada
        }
      });

      var respostaPalpites = await api.get("/palpites/", {
        params: {
          usuario_id: usuario.id,
          rodada: rodada
        }
      });

      setJogos(respostaJogos.data);

      var palpitesIniciais = {};

      respostaPalpites.data.forEach(function (palpite) {
        palpitesIniciais[palpite.jogo] = {
          gols_mandante: palpite.gols_mandante,
          gols_visitante: palpite.gols_visitante
        };
      });

      setPalpites(palpitesIniciais);
    } catch (error) {
      setMensagem("Erro ao carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  function alterarPalpite(jogoId, campo, valor) {
    setPalpites(function (anterior) {
      return {
        ...anterior,
        [jogoId]: {
          ...anterior[jogoId],
          [campo]: valor
        }
      };
    });
  }

  async function salvarPalpites() {
    var listaPalpites = [];

    Object.entries(palpites).forEach(function ([jogoId, palpite]) {
      if (
        palpite.gols_mandante === undefined ||
        palpite.gols_visitante === undefined ||
        palpite.gols_mandante === "" ||
        palpite.gols_visitante === ""
      ) {
        return;
      }

      listaPalpites.push({
        jogo_id: Number(jogoId),
        gols_mandante: Number(palpite.gols_mandante),
        gols_visitante: Number(palpite.gols_visitante)
      });
    });

    try {
      await api.post("/palpites/salvar/", {
        usuario_id: usuario.id,
        palpites: listaPalpites
      });

      setMensagem("Palpites salvos com sucesso!");
    } catch (error) {
      setMensagem("Erro ao salvar os palpites.");
    }
  }

  // Função auxiliar para garantir a URL completa da imagem
//   function obterUrlEscudo(caminhoEscudo) {
//     if (!caminhoEscudo) return "";
//     return caminhoEscudo.startsWith("http")
//       ? caminhoEscudo
//       : `http://127.0.0.1:8000${caminhoEscudo}`;
//   }

function obterUrlEscudo(caminhoEscudo) {
  if (!caminhoEscudo) return "";
  
  // Se a URL já vier completa da API, apenas retorna
  if (caminhoEscudo.startsWith("http")) return caminhoEscudo;

  // Pega a URL do backend configurada na variável de ambiente do Vite
  let baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // Remove o "/api" do final se ele existir (ex: transforma "...onrender.com/api" em "...onrender.com")
  baseUrl = baseUrl.replace(/\/api\/?$/, "");

  // Limpa as barras para evitar barras duplas (//)
  const urlLimpa = baseUrl.replace(/\/$/, "");
  const caminhoLimpo = caminhoEscudo.startsWith("/") ? caminhoEscudo : `/${caminhoEscudo}`;

  return `${urlLimpa}${caminhoLimpo}`;
}

//////////////////

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Meus Palpites</h1>
          <p>Olá, {usuario?.nome}!</p>
        </div>

        <Form.Select
          value={rodada}
          onChange={function (event) {
            setRodada(Number(event.target.value));
          }}
          style={{ maxWidth: "180px" }}
        >
          {Array.from({ length: 38 }, function (_, index) {
            return (
              <option key={index + 1} value={index + 1}>
                Rodada {index + 1}
              </option>
            );
          })}
        </Form.Select>
      </div>

      {mensagem && <Alert variant="info">{mensagem}</Alert>}

      {carregando ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {jogos.map(function (jogo) {
            var bloqueado = jogo.status !== "AGENDADO";

            return (
              <Col xs={12} md={6} lg={4} className="mb-4" key={jogo.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-center fs-6 text-black mb-3">
                      {jogo.mandante.nome} x {jogo.visitante.nome}
                    </Card.Title>

                    <Card.Text className="text-center small text-black mb-3">
                      {new Date(jogo.data_hora).toLocaleString("pt-BR")}
                    </Card.Text>

                    {bloqueado && (
                      <Alert variant="secondary" className="text-center py-1 small">
                        Palpites encerrados
                      </Alert>
                    )}

                    <Row className="align-items-center text-center">
                      {/* MANDANTE */}
                      <Col>
                        <div className="d-flex flex-column align-items-center mb-2">
                          {jogo.mandante.escudo && (
                            <img
                              src={obterUrlEscudo(jogo.mandante.escudo)}
                              alt={jogo.mandante.nome}
                              style={{
                                width: "75px",
                                height: "75px",
                                objectFit: "contain"
                              }}
                              className="mb-1"
                            />
                          )}
                          <Form.Label className="mb-0 fw-bold">
                            {jogo.mandante.sigla}
                          </Form.Label>
                        </div>

                        <Form.Control
                          type="number"
                          min="0"
                          disabled={bloqueado}
                          className="text-center"
                          value={palpites[jogo.id]?.gols_mandante ?? ""}
                          onChange={function (event) {
                            alterarPalpite(
                              jogo.id,
                              "gols_mandante",
                              event.target.value
                            );
                          }}
                        />
                      </Col>

                      {/* X (VS) */}
                      <Col xs="auto" className="fw-bold align-self-end mb-2">
                        X
                      </Col>

                      {/* VISITANTE */}
                      <Col>
                        <div className="d-flex flex-column align-items-center mb-2">
                          {jogo.visitante.escudo && (
                            <img
                              src={obterUrlEscudo(jogo.visitante.escudo)}
                              alt={jogo.visitante.nome}
                              style={{
                                width: "75px",
                                height: "75px",
                                objectFit: "contain"
                              }}
                              className="mb-1"
                            />
                          )}
                          <Form.Label className="mb-0 fw-bold">
                            {jogo.visitante.sigla}
                          </Form.Label>
                        </div>

                        <Form.Control
                          type="number"
                          min="0"
                          disabled={bloqueado}
                          className="text-center"
                          value={palpites[jogo.id]?.gols_visitante ?? ""}
                          onChange={function (event) {
                            alterarPalpite(
                              jogo.id,
                              "gols_visitante",
                              event.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Button
        variant="success"
        className="w-100 mt-3"
        size="lg"
        onClick={salvarPalpites}
      >
        Salvar Palpites
      </Button>
    </Container>
  );
}

export default Palpites;