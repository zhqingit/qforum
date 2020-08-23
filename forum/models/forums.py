from django.db import models
from .statuslog import StatusLog
#from .thread import Thread
from django.template.defaultfilters import slugify
from django.dispatch.dispatcher import receiver
from django.db.models.signals import post_delete


class Section(models.Model):
    name = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    status = models.CharField(max_length=50,null=True,default='active')


    def __str__(self):
        return self.slug

    def createStatus(self,status):
        sl = StatusLog.objects.create(model="Section",status=status,instance=self.pk)
        sl.save()

    def save(self, *args, **kwargs):
        new = False
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.name)
            new = True
        super(Section, self).save(*args, **kwargs)
        if new:
            self.createStatus("create")

    def delete(self, *args, **kwargs):
        self.status = 'delete'
        self.save()
        self.createStatus("delete")
        forums = Forum.objects.filter(section_id=self.id)
        for forum in forums:
            forum.delete()

    def hide(self, *args, **kwargs):
        self.status = 'hide'
        self.save()
        self.createStatus("hide")
        forums = Forum.objects.filter(section_id=self.id)
        for forum in forums:
            forum.hide()

    def active(self, *args, **kwargs):
        self.status = 'active'
        self.save()
        self.createStatus("active")
        forums = Forum.objects.filter(section_id=self.id)
        for forum in forums:
            forum.active()



class Forum(models.Model):
    """ Model to represent forum e.g: General forum """
    name = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    createtime = models.DateTimeField(auto_now_add=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=False, related_name="Section")
    status = models.CharField(max_length=50,null=True)
    nThread = models.IntegerField(default=0)
    nPost = models.IntegerField(default=0)

    def __str__(self):
        return self.slug

    def inc_thread (self,times=1):
        self.nThread += times
        self.save()

    def inc_post (self,times=1):
        self.nPost += times
        self.save()

    def createStatus(self,status):
        sl = StatusLog.objects.create(model="Forum",status=status,instance=self.pk)
        sl.save()

    def save(self, *args, **kwargs):
        new = False
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.name)
            new = True
        super(Forum, self).save(*args, **kwargs)
        if new:
            self.createStatus("create")

    def delete(self, *args, **kwargs):
        self.status = 'delete'
        self.save()
        self.createStatus("delete")
        from .thread import Thread
        threads = Thread.objects.filter(forum_id=self.id)
        for thread in threads:
            thread.active()

    def hide(self, *args, **kwargs):
        self.status = 'hide'
        self.save()
        self.createStatus("hide")
        from .thread import Thread
        threads = Thread.objects.filter(forum_id=self.id)
        for thread in threads:
            thread.hide()

    def active(self, *args, **kwargs):
        self.status = 'active'
        self.save()
        self.createStatus("active")
        from .thread import Thread
        threads = Thread.objects.filter(forum_id=self.id)
        for thread in threads:
            thread.active()
