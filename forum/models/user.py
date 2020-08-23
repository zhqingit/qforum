from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime

from .constant import USERADD
from .managers import CustomUserManager



# Create your models here.
def user_directory_avatar(instance,filename):
    return 'forum/user/{0}/avatar/{1}'.format(instance.user.email,filename)
    #return 'forum/user/avatar/test.jpg'

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def last_login_update(self):
        self.last_login = datetime.utcnow()



class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    nickname = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to=user_directory_avatar,blank=True)
    #authToken = models.CharField(max_length=1000,null=True)
    #refreshToken = models.CharField(max_length=1000,null=True)
    private_key = models.CharField(max_length=2000,null=True)
    last_active = models.DateTimeField(null=True)

    def last_active_update(self):
        self.last_active = datetime.utcnow()

#@receiver(post_save, sender=CustomUser, dispatch_uid="CustomUser_post_save")
@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        pass
    else:
        if all(hasattr(instance, '_'+attr) for attr in USERADD):
            UserProfile.objects.create(user=instance,
                                       nickname=instance._nickname,
                                       avatar=instance._avatar)
