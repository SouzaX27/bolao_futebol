from django.db.models import (
    Sum,
    Count,
    Q
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Usuario,
    Time,
    Jogo,
    Palpite
)

from .serializers import (
    UsuarioSerializer,
    TimeSerializer,
    JogoSerializer,
    JogoAdminSerializer,
    PalpiteSerializer
)


class UsuarioLoginView(APIView):

    def post(self, request):

        nome = request.data.get(
            "nome",
            ""
        ).strip()

        if not nome:

            return Response(
                {
                    "erro":
                    "Informe um nome ou nickname."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario, criado = (
            Usuario.objects.get_or_create(
                nome=nome
            )
        )

        serializer = UsuarioSerializer(
            usuario
        )

        return Response(
            {
                "usuario":
                serializer.data,

                "novo_usuario":
                criado
            }
        )


class TimesView(APIView):

    def get(self, request):

        times = Time.objects.all().order_by(
            "nome"
        )

        serializer = TimeSerializer(
            times,
            many=True
        )

        return Response(
            serializer.data
        )

    def post(self, request):

        serializer = TimeSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class JogosView(APIView):

    def get(self, request):

        rodada = request.query_params.get(
            "rodada"
        )

        jogos = Jogo.objects.select_related(
            "mandante",
            "visitante"
        ).order_by(
            "data_hora"
        )

        if rodada:

            try:

                rodada = int(
                    rodada
                )

                jogos = jogos.filter(
                    rodada=rodada
                )

            except ValueError:

                return Response(
                    {
                        "erro":
                        "Rodada inválida."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = JogoSerializer(
            jogos,
            many=True
        )

        return Response(
            serializer.data
        )

    def post(self, request):

        serializer = JogoAdminSerializer(
            data=request.data
        )

        if serializer.is_valid():

            jogo = serializer.save()

            return Response(
                JogoAdminSerializer(
                    jogo
                ).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class JogoAdminDetailView(APIView):

    def put(
        self,
        request,
        jogo_id
    ):

        try:

            jogo = Jogo.objects.get(
                id=jogo_id
            )

        except Jogo.DoesNotExist:

            return Response(
                {
                    "erro":
                    "Jogo não encontrado."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JogoAdminSerializer(
            jogo,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class SalvarPalpitesView(APIView):

    def post(self, request):

        usuario_id = request.data.get(
            "usuario_id"
        )

        palpites = request.data.get(
            "palpites",
            []
        )

        if not usuario_id:

            return Response(
                {
                    "erro":
                    "Usuário não informado."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            usuario = Usuario.objects.get(
                id=usuario_id
            )

        except Usuario.DoesNotExist:

            return Response(
                {
                    "erro":
                    "Usuário não encontrado."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        salvos = []

        for item in palpites:

            jogo_id = item.get(
                "jogo_id"
            )

            gols_mandante = item.get(
                "gols_mandante"
            )

            gols_visitante = item.get(
                "gols_visitante"
            )

            if (
                jogo_id is None
                or gols_mandante is None
                or gols_visitante is None
            ):

                continue

            try:

                jogo = Jogo.objects.get(
                    id=jogo_id
                )

            except Jogo.DoesNotExist:

                continue

            # Só permite salvar ou alterar
            # palpites de jogos agendados.

            if jogo.status != "AGENDADO":

                continue

            palpite, criado = (
                Palpite.objects.update_or_create(

                    usuario=usuario,

                    jogo=jogo,

                    defaults={

                        "gols_mandante":
                        int(
                            gols_mandante
                        ),

                        "gols_visitante":
                        int(
                            gols_visitante
                        )

                    }

                )
            )

            salvos.append(
                palpite.id
            )

        return Response(
            {
                "mensagem":
                "Palpites salvos com sucesso.",

                "palpites":
                salvos
            }
        )


class MeusPalpitesView(APIView):

    def get(self, request):

        usuario_id = request.query_params.get(
            "usuario_id"
        )

        rodada = request.query_params.get(
            "rodada"
        )

        if not usuario_id:

            return Response(
                {
                    "erro":
                    "Usuário não informado."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        palpites = Palpite.objects.filter(
            usuario_id=usuario_id
        ).select_related(
            "jogo"
        )

        if rodada:

            palpites = palpites.filter(
                jogo__rodada=rodada
            )

        serializer = PalpiteSerializer(
            palpites,
            many=True
        )

        return Response(
            serializer.data
        )


class RankingView(APIView):

    def get(self, request):

        usuarios = Usuario.objects.annotate(

            pontos_totais=Sum(
                "palpites__pontos"
            ),

            acertos_exatos=Count(
                "palpites",
                filter=Q(
                    palpites__pontos=3
                )
            ),

            acertos_simples=Count(
                "palpites",
                filter=Q(
                    palpites__pontos=1
                )
            ),

            total_palpites=Count(
                "palpites"
            )

        ).order_by(

            "-pontos_totais",

            "-acertos_exatos",

            "nome"

        )

        resultado = []

        for posicao, usuario in enumerate(
            usuarios,
            start=1
        ):

            resultado.append(
                {

                    "posicao":
                    posicao,

                    "usuario_id":
                    usuario.id,

                    "nome":
                    usuario.nome,

                    "pontos_totais":
                    usuario.pontos_totais or 0,

                    "acertos_exatos":
                    usuario.acertos_exatos,

                    "acertos_simples":
                    usuario.acertos_simples,

                    "total_palpites":
                    usuario.total_palpites

                }
            )

        return Response(
            resultado
        )


class CalcularPontosView(APIView):

    def post(self, request):

        jogos_finalizados = (
            Jogo.objects.filter(
                status="FINALIZADO"
            )
        )

        total_calculados = 0

        for jogo in jogos_finalizados:

            if (
                jogo.gols_mandante is None
                or
                jogo.gols_visitante is None
            ):

                continue

            palpites = Palpite.objects.filter(
                jogo=jogo
            )

            for palpite in palpites:

                pontos = 0

                # ACERTO EXATO
                if (

                    palpite.gols_mandante
                    ==
                    jogo.gols_mandante

                    and

                    palpite.gols_visitante
                    ==
                    jogo.gols_visitante

                ):

                    pontos = 3

                else:

                    resultado_real = (

                        jogo.gols_mandante
                        -
                        jogo.gols_visitante

                    )

                    resultado_palpite = (

                        palpite.gols_mandante
                        -
                        palpite.gols_visitante

                    )

                    # Vitória do mandante
                    if (

                        resultado_real > 0
                        and
                        resultado_palpite > 0

                    ):

                        pontos = 1

                    # Vitória do visitante
                    elif (

                        resultado_real < 0
                        and
                        resultado_palpite < 0

                    ):

                        pontos = 1

                    # Empate
                    elif (

                        resultado_real == 0
                        and
                        resultado_palpite == 0

                    ):

                        pontos = 1

                palpite.pontos = pontos

                palpite.save(
                    update_fields=[
                        "pontos"
                    ]
                )

                total_calculados += 1

        return Response(
            {

                "mensagem":
                "Pontuação recalculada com sucesso.",

                "palpites_calculados":
                total_calculados

            }
        )