import jwt
from datetime import datetime, timedelta
from forum.models import CustomUser, UserProfile

#from .constant import PUBLICKEY, PRIVATEKEY, AUTHTOKEN_TIMEDELTA, REFRESHTOKEN_TIMEDELTA, TOKENALG, AUTHTOKEN, REFRESHTOKEN
from .constant import *

def gen_token(userid):
    private_key = open(PRIVATEKEY).read()
    authPayload = {"id":userid,"iat":datetime.utcnow(),"exp":datetime.utcnow()+timedelta(seconds=AUTHTOKEN_TIMEDELTA),"nbf":datetime.utcnow()}
    authToken = jwt.encode(authPayload,private_key,algorithm=TOKENALG)
    refreshPayload = {"id":userid,"iat":datetime.utcnow(),"exp":datetime.utcnow()+timedelta(days=REFRESHTOKEN_TIMEDELTA),"nbf":datetime.utcnow()}
    refreshToken = jwt.encode(refreshPayload,private_key,algorithm=TOKENALG)
    #decode = jwt.decode(authToken,private_key,algorithm='HS256')
    #header = jwt.get_unverified_header(authToken)
    #print(authToken,"-----",decode,'----------',header)
    #print(authToken,"-----",refreshToken)
    return(authToken.decode("utf-8"),refreshToken.decode("utf-8"))

def if_need_update(exp,lim):
    dif = datetime.fromtimestamp(int(exp)) - datetime.utcnow()
    needupdate = True if dif.total_seconds()/60 <= lim else False
    return needupdate

def is_auth(context):
    if AUTHTOKEN in context and context[AUTHTOKEN]:
        try:
            private_key = open(PRIVATEKEY).read()
            options = {"verify_exp":True}
            payload = jwt.decode(context[AUTHTOKEN], private_key , algorithms=[TOKENALG], options=options)
            needupdate = if_need_update(int(payload["exp"]),AUTHTOKEN_UPDATEDELTA)
            #print(options,'==============',payload)
            return {"user":payload["id"], "isAuth":True, "needupdate":needupdate}
        except (jwt.DecodeError, jwt.ExpiredSignatureError):
            return {"isAuth":False}
    else:
        return {"isAuth":False}

def is_super(context):
    isauth = is_auth(context)
    if isauth["isAuth"]:
        id = isauth["user"]
        try:
            user = CustomUser.objects.get(pk=id)
            if user.groups.filter(name=SUPERGROUP).exists():
                return {'isSuper':True, 'message':""}
            else:
                return {'isSuper':False, 'message':"Not super"}
        except:
            return {'isSuper':False, 'message':"No user"}
    else:
        return {'isSuper':False, 'message':"Not authticated"}


def updateToken(kargs):
    if REFRESHTOKEN in kargs:
        try:
            private_key = open(PRIVATEKEY).read()
            options = {"verify_exp":True}
            payload = jwt.decode(kargs[REFRESHTOKEN], private_key , algorithms=[TOKENALG], options=options)
            #print(payload,'000000000000000000')
            needupdate = if_need_update(int(payload["exp"]),REFRESHTOKEN_UPDATEDELTA)
            #print(dif.total_seconds(),'000000000000000000',datetime.fromtimestamp(int(payload["exp"])))
            return {"user":payload["id"],"updated":True,"needupdate":needupdate}
        except (jwt.DecodeError, jwt.ExpiredSignatureError):
            return {"updated":False}
    else:
        return {"updated":False}
