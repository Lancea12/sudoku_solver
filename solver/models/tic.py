from django.db import models
from solver.models.board import Board

class Tic(models.Model):
    board = models.ForeignKey(Board)
    tic_num = models.IntegerField()
    cells_left = models.IntegerField(default=9)

    class Meta:
        app_label = "solver"


