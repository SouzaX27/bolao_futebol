from django.db import models


class Usuario(models.Model):

    nome = models.CharField(
        max_length=100,
        unique=True
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.nome


class Time(models.Model):

    nome = models.CharField(
        max_length=100,
        unique=True
    )

    sigla = models.CharField(
        max_length=5,
        blank=True
    )

    # escudo = models.ImageField(
    #     upload_to="escudos/",
    #     blank=True,
    #     null=True
    # )

    
    escudo = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nome


class Jogo(models.Model):

    STATUS_CHOICES = [
        ("AGENDADO", "Agendado"),
        ("AO_VIVO", "Ao Vivo"),
        ("FINALIZADO", "Finalizado"),
    ]

    rodada = models.PositiveIntegerField()

    mandante = models.ForeignKey(
        Time,
        on_delete=models.CASCADE,
        related_name="jogos_mandante"
    )

    visitante = models.ForeignKey(
        Time,
        on_delete=models.CASCADE,
        related_name="jogos_visitante"
    )

    data_hora = models.DateTimeField()

    gols_mandante = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    gols_visitante = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="AGENDADO"
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    atualizado_em = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            f"{self.mandante} x "
            f"{self.visitante} - "
            f"Rodada {self.rodada}"
        )

    @property
    def finalizado(self):

        return self.status == "FINALIZADO"


class Palpite(models.Model):

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="palpites"
    )

    jogo = models.ForeignKey(
        Jogo,
        on_delete=models.CASCADE,
        related_name="palpites"
    )

    gols_mandante = models.PositiveIntegerField()

    gols_visitante = models.PositiveIntegerField()

    pontos = models.PositiveIntegerField(
        default=0
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    atualizado_em = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "usuario",
                    "jogo"
                ],
                name="palpite_unico_usuario_jogo"
            )
        ]

    def __str__(self):

        return (
            f"{self.usuario} - "
            f"{self.jogo} - "
            f"{self.gols_mandante}x"
            f"{self.gols_visitante}"
        )