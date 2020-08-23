from django.db import models


class StatusLog(models.Model):
    model = models.CharField(max_length=50)
    changetime = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50)
    instance = models.IntegerField()


    def __str__(self):
        return self.model+self.status
