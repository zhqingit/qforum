
from django.db import models
from django.utils.text import Truncator
from .user import CustomUser
from .thread import Thread
from .statuslog import StatusLog

class Post(models.Model):
    content = models.TextField()
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE,related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="posts")
    status = models.CharField(max_length=50,null=True,default='active')


    class Meta:
        ordering=['created_at']

    def __str__(self):
        truncated_content = Truncator(self.content)
        return truncated_content.chars(30)

    def createStatus(self,status):
        sl = StatusLog.objects.create(model="Post",status=status,instance=self.pk)
        sl.save()

    def delete(self, *args, **kwargs):
        self.status = 'delete'
        self.save()
        self.createStatus("delete")

    def hide(self, *args, **kwargs):
        self.status = 'hide'
        self.save()
        self.createStatus("hide")

    def active(self, *args, **kwargs):
        self.status = 'active'
        self.save()
        self.createStatus("active")
