from django.db import models
from django.utils.text import Truncator
from django.utils.timezone import now
from .forums import Forum
from .user import CustomUser
from .statuslog import StatusLog
#from .post import Post
from datetime import datetime

class Thread(models.Model):
    """ Model to represent a thread in a forum """
    title = models.CharField(max_length=255)
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name='threads')
    pinned = models.BooleanField(default=False)
    content = models.TextField()
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='threads')
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(default=now)
    status = models.CharField(max_length=50,null=True,default='active')
    nPost = models.IntegerField(default=0)
    nView = models.IntegerField(default=0)

    class Meta:
        ordering = [
            '-pinned',
            '-last_activity'
        ]

    def __str__(self):
        truncated_name = Truncator(self.title)
        return truncated_name.chars(30)

    def inc_post (self,times=1):
        self.nPost += times
        self.save()

    def inc_view (self,times=1):
        self.nView += times
        print('========');
        self.save()

    def update_active(self):
        self.last_activity = datetime.utcnow()
        self.save()

    def createStatus(self,status):
        sl = StatusLog.objects.create(model="Thread",status=status,instance=self.pk)
        sl.save()

    def delete(self, *args, **kwargs):
        self.status = 'delete'
        self.save()
        self.createStatus("delete")
        from .post import Post
        posts = Post.objects.filter(thread_id=self.id)
        for post in posts:
            forum.delete()

    def hide(self, *args, **kwargs):
        self.status = 'hide'
        self.save()
        self.createStatus("hide")
        from .post import Post
        posts = Post.objects.filter(thread_id=self.id)
        for post in posts:
            post.hide()

    def active(self, *args, **kwargs):
        self.status = 'active'
        self.save()
        self.createStatus("active")
        from .post import Post
        posts = Post.objects.filter(thread_id=self.id)
        for post in posts:
            post.active()
