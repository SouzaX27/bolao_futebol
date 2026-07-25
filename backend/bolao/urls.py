from django.urls import path

from .views import (
    UsuarioLoginView,
    TimesView,
    JogosView,
    JogoAdminDetailView,
    SalvarPalpitesView,
    MeusPalpitesView,
    RankingView,
    CalcularPontosView
)


urlpatterns = [

    path(
        "usuarios/login/",
        UsuarioLoginView.as_view()
    ),

    path(
        "times/",
        TimesView.as_view()
    ),

    path(
        "jogos/",
        JogosView.as_view()
    ),

    path(
        "jogos/<int:jogo_id>/",
        JogoAdminDetailView.as_view()
    ),

    path(
        "palpites/salvar/",
        SalvarPalpitesView.as_view()
    ),

    path(
        "palpites/",
        MeusPalpitesView.as_view()
    ),

    path(
        "ranking/",
        RankingView.as_view()
    ),

    path(
        "admin/calcular-pontos/",
        CalcularPontosView.as_view()
    )

]