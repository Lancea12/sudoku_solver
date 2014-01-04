from django.db import models
from solver.models.board import Board

class Column(models.Model):
    board = models.ForeignKey(Board)
    col_num = models.IntegerField()
    cells_left = models.IntegerField(default=9)

    class Meta:
        app_label = "solver"


