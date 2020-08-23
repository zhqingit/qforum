from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from base64 import b64decode
from Crypto.Random import get_random_bytes

def resolve_user(_, info):
    print("test---------")
    return "test--"

def resolve_login(_, info, username, password):
    print("test---------1111")
    return {"token":"test","fail":False, "message":""}

#def resolve_register(_, info, username, password, email, nickname):
def resolve_register(_, info, **args):
    # Decrypt the session key with the private RSA key
    private_key = RSA.import_key(open("private.pem").read())
    cipher_rsa = PKCS1_OAEP.new(private_key)
    #decoded = cipher_rsa.decrypt(b64decode(args["username"])).decode("utf-8")
    decoded = cipher_rsa.decrypt(args["username"]).decode("utf-8")
    print("test---------", args, decoded)
    return {"fail":True, "message":"test"}

def get_pubkey():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    #return(private_key.decode("utf-8"), public_key.decode("utf-8"))
    #return(private_key, public_key)
    return(key, key.publickey())

def resolve_pubkey():
    (private_key, public_key) = get_pubkey()
    session_key = get_random_bytes(16)
    #key = RSA.generate(2048)
    #private_key = key.export_key()
    #file_out = open("private.pem", "wb")
    #file_out.write(private_key)
    #file_out.close()

    #public_key = key.publickey().export_key()
    #file_out = open("receiver.pem", "wb")
    #file_out.write(public_key)
    #file_out.close()

    data = "I met aliens in UFO. Here is the map.".encode("utf-8")

    #recipient_key = RSA.import_key(open("receiver.pem").read())
    #session_key = get_random_bytes(16)

    # Encrypt the session key with the public RSA key
    cipher_rsa = PKCS1_OAEP.new(public_key)
    enc_data = cipher_rsa.encrypt(data)


    # Decrypt the session key with the private RSA key
    cipher_rsa = PKCS1_OAEP.new(private_key)
    dec_data = cipher_rsa.decrypt(enc_data)
    print(enc_data, dec_data)

resolve_pubkey()
