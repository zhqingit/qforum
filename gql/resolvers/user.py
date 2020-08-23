from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from forum.models import CustomUser, UserProfile
from utils.token import is_auth, is_super
from .constant import USERADD
import utils.user as usertool

def resolve_isSuper(_, info, **kargs):
    return is_super(info.context)

def resolve_userProfile(_, info, **kargs):
    isauth = is_auth(info.context)
    if isauth["isAuth"]:
        id = isauth["user"]
        try:
            user = CustomUser.objects.get(pk=id)
            try:
                user_profile = UserProfile.objects.get(user=user)
                return {"avatar":user_profile.avatar, "nickname":user_profile.nickname,"email":user.email,"message":""}
            except:
                return {"message":"NoUserSetting"}
        except:
            return {"message":"NoUser"}
    else:
        return {"message":"isNotAuth"}


def resolve_updateSetting(_, info, **kargs):
    isauth = is_auth(info.context)
    if isauth["isAuth"]:
        id = isauth["user"]
        try:
            user = CustomUser.objects.get(pk=id)
            try:
                user_profile = UserProfile.objects.get(user=user)
                usertool.update_last_active(user_profile)
                #private_key = user_profile.private_key
                #cipher_rsa = PKCS1_v1_5.new(RSA.importKey(private_key))
                #if ENCODEDVARS in kargs:
                    #kargs = decode_set(cipher_rsa, kargs, kargs[ENCODEDVARS])
                #print(kargs,'===========')
                for var in USERADD:
                    if var in kargs:
                        setattr(user_profile, var, kargs[var])
                user_profile.save()
                return {"fail":False, "message":""}

            except:
                return {"fail":True, "message":"Account setting wrong!"}
        except:
            return {"fail":True, "message":"Account doesn't exists!"}
    else:
        return {"fail":True, "message":"Account not authenticated, please login in firstly"}
