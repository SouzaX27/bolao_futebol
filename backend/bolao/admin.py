from django.contrib import admin

from .models import (
    Usuario,
    Time,
    Jogo,
    Palpite
)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "nome",
        "criado_em"
    ]

    search_fields = [
        "nome"
    ]


@admin.register(Time)
class TimeAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "nome",
        "sigla"
    ]

    search_fields = [
        "nome"
    ]


@admin.register(Jogo)
class JogoAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "rodada",
        "mandante",
        "visitante",
        "data_hora",
        "status",
        "gols_mandante",
        "gols_visitante"
    ]

    list_filter = [
        "rodada",
        "status"
    ]


@admin.register(Palpite)
class PalpiteAdmin(admin.ModelAdmin):

    list_display = [
        "usuario",
        "jogo",
        "gols_mandante",
        "gols_visitante",
        "pontos"
    ]

    list_filter = [
        "pontos"
    ]