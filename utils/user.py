from forum.models import CustomUser, UserProfile
from Crypto.PublicKey import RSA

def update_last_login(user):
    try:
        user.last_login_update()
        user.save()
        return True
    except:
        return False

def update_last_active(user_profile):
    try:
        user_profile.last_active_update()
        user_profile.save()
        return True
    except:
        return False

def save_token(user_profile,authToken,refreshToken):
    try:
        user_profile.authToken = authToken
        user_profile.refreshToken = refreshToken
        user_profile.save()
        return True
    except:
        return False


def get_userkeys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return(private_key.decode("utf-8"), public_key.decode("utf-8"))

def get_user(user_id):
    try:
        user = CustomUser.objects.get(pk=user_id)
    except:
        user=None

    if user:
        try:
            user_profile = UserProfile.objects.get(user=user)
        except:
            user_profile =  None
    else:
        user_profile = None

    return(user, user_profile)

def get_userProfile(user, user_id):
    if user:
        try:
            user_profile = UserProfile.objects.get(user=user)
        except:
            user_profile = None
    else:
        try:
            user_profile = UserProfile.objects.get(user_id=user_id)
        except:
            user_profile = None
    return(user_profile)        
