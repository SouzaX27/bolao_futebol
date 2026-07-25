from rest_framework import serializers

from .models import (
    Usuario,
    Time,
    Jogo,
    Palpite
)


class UsuarioSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Usuario

        fields = [
            "id",
            "nome"
        ]


class TimeSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Time

        fields = [
            "id",
            "nome",
            "sigla",
            "escudo"
        ]


class JogoSerializer(
    serializers.ModelSerializer
):

    mandante = TimeSerializer(
        read_only=True
    )

    visitante = TimeSerializer(
        read_only=True
    )

    class Meta:

        model = Jogo

        fields = [
            "id",
            "rodada",
            "mandante",
            "visitante",
            "data_hora",
            "gols_mandante",
            "gols_visitante",
            "status",
            "finalizado"
        ]


class JogoAdminSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Jogo

        fields = [
            "id",
            "rodada",
            "mandante",
            "visitante",
            "data_hora",
            "gols_mandante",
            "gols_visitante",
            "status"
        ]


class PalpiteSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Palpite

        fields = [
            "id",
            "jogo",
            "gols_mandante",
            "gols_visitante",
            "pontos"
        ]

        read_only_fields = [
            "id",
            "pontos"
        ]


class RankingSerializer(
    serializers.Serializer
):

    posicao = serializers.IntegerField()

    usuario_id = serializers.IntegerField()

    nome = serializers.CharField()

    pontos_totais = serializers.IntegerField()

    acertos_exatos = serializers.IntegerField()

    acertos_simples = serializers.IntegerField()

    total_palpites = serializers.IntegerField()