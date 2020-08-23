from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP,PKCS1_v1_5
from base64 import b64decode
from .constant import ENCODEDVARS,PUBLICKEY,PRIVATEKEY, LOGO, USERADD

from forum.models import CustomUser, UserProfile
from utils.token import gen_token, is_auth, updateToken
import utils.user as usertool

def decode_set(cipher_rsa, values, encodedVars):
    for var in encodedVars:
        values[var] = cipher_rsa.decrypt(b64decode(values[var]),"ERROR").decode("utf-8")
    return values

def resolve_user(_, info):
    print("test---------")
    return "test--"


def resolve_userpubkey(_, info):
    (private_key, public_key) = get_pubkey()
    return public_key

def resolve_login(_, info, **kargs):
    if ENCODEDVARS in kargs: #decode information
        private_key = RSA.import_key(open(PRIVATEKEY).read())
        cipher_rsa = PKCS1_v1_5.new(private_key)
        kargs = decode_set(cipher_rsa, kargs, kargs[ENCODEDVARS])

    if not "email" in kargs or not "password"  in kargs:
        return {"fail":True, "message":"Please input email and password"}

    #auth account
    user = authenticate(email=kargs["email"], password=kargs["password"])
    #print(kargs,'-------',user)

    if user is not None:
        if not usertool.update_last_login(user):
            return {"fail":True, "message":"Account update incorrect!"}
        try:
            user_profile = UserProfile.objects.get(user=user)
            (authToken, refreshToken) = gen_token(user.id)
            if not usertool.update_last_active(user_profile):
                return {"updated":False, "message":"Account update active incorrect!"}
            #if not usertool.save_token(user_profile,authToken,refreshToken):
                #return {"fail":True, "message":"Account save token incorrect!"}

            (prikey, pubkey) = usertool.get_userkeys()
            user_profile.private_key = prikey
            user_profile.save()
            if "remember" in kargs and kargs['remember']:
                return {"authToken":authToken,"refreshToken":refreshToken,"fail":False, "message":"",
                    "key":pubkey,"avatar":user_profile.avatar, "nickname":user_profile.nickname}
            else:
                return {"authToken":authToken,"fail":False, "message":"",
                    "key":pubkey,"avatar":user_profile.avatar, "nickname":user_profile.nickname}

        except ObjectDoesNotExist:
            return {"fail":True, "message":"Account abnormal"}
    else:
        return {"fail":True, "message":"Account not exists or incorrect password"}

def resolve_resetPassword(_, info, **kargs):
    isauth = is_auth(info.context)
    if isauth["isAuth"]:
        id = isauth["user"]
        try:
            user = CustomUser.objects.get(pk=id)
            try:
                user_profile = UserProfile.objects.get(user=user)
                usertool.update_last_active(user_profile)
                private_key = user_profile.private_key
                cipher_rsa = PKCS1_v1_5.new(RSA.importKey(private_key))
                if ENCODEDVARS in kargs:
                    kargs = decode_set(cipher_rsa, kargs, kargs[ENCODEDVARS])
                user = authenticate(email=user.email, password=kargs["opassword"])
                if user is not None:
                    user.set_password(kargs["password"])
                    user.save()
                    return {"fail":False, "message":""}
                else:
                    return {"fail":True, "message":"Account not exist or password wrong!"}
            except:
                return {"fail":True, "message":"Account setting wrong!"}
        except:
            return {"fail":True, "message":"Account doesn't exists!"}
    else:
        return {"fail":True, "message":"Account not authenticated, please login in firstly"}


def resolve_register(_, info, **kargs):
    # Decrypt the session key with the private RSA key
    private_key = RSA.import_key(open(PRIVATEKEY).read())
    #cipher_rsa = PKCS1_OAEP.new(private_key)
    cipher_rsa = PKCS1_v1_5.new(private_key)
    #password = cipher_rsa.decrypt(b64decode(args["password"]),"ERROR").decode("utf-8")

    if not "email" in  kargs or not "password" in kargs:
        return {"fail":True, "message":"No account information!"}

    if ENCODEDVARS in kargs:
        kargs = decode_set(cipher_rsa, kargs, kargs[ENCODEDVARS])

    try:
        CustomUser.objects.get(email=kargs["email"])
        return {"fail":True, "message":"Account exists!"}
    except:
        #user = CustomUser.objects.create_user(email=kargs["email"],password=kargs["password"])
        #print(kargs,'----------------------------',info.context)
        try:
            user = CustomUser.objects.create_user(email=kargs["email"],password=kargs["password"])
            if not "nickname" in kargs:
                kargs["nickname"] = kargs["email"].split("@")[0]
            if not "avatar" in kargs:
                kargs["avatar"] = LOGO
            for var in USERADD:
                vvar = "_"+var
                setattr(user, vvar, kargs[var])
            user.save()
            return {"fail":False, "message":""}
        except:
            return {"fail":True, "message":"Creating account failed!"}

    return {"fail":True, "message":""}


def resolve_pubkey(_, info):
    public_key = RSA.import_key(open(PUBLICKEY).read())
    return public_key.export_key().decode("utf-8")


def resolve_isAuthenticated(_, info, **kargs):
    isauth = is_auth(info.context)
    #print('------',info,'===========',isauth)
    if isauth["isAuth"]:
        if isauth["needupdate"]:
            #(authToken, refreshToken) = gen_token(isauth["user"])
            return {"isAuth":True, "needUpdate":True}
            #return {"isAuth":True}
        else:
            return {"isAuth":True}
    else:
        return {"isAuth":False}

def resolve_isAuthenticated1(_, info, **kargs):
    isauth = is_auth(info.context)
    if isauth["isAuth"]:
        if isauth["needupdate"]:
            #(authToken, refreshToken) = gen_token(isauth["user"])
            return {"isAuth":True, "needUpdate":True}
            #return {"isAuth":True}
        else:
            return {"isAuth":True}
    else:
        return {"isAuth":False}

def resolve_updateToken(_, info, **kargs):
    update = updateToken(kargs)
    print(update,"------------",kargs)
    if update["updated"]:
        try:
            #print(update,"=============",kargs)
            user = CustomUser.objects.get(id=update["user"])
            try:
                user_profile = UserProfile.objects.get(user=user)
                (authToken, refreshToken) = gen_token(update["user"])
                if update["needupdate"]:
                    return {"updated":True,"authToken":authToken, "refreshToken":refreshToken}
                else:
                    return {"updated":True,"authToken":authToken}
            except:
                return {"updated":False}
        except:
            return {"updated":False}
