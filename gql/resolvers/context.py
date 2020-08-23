import jwt

def contextValue(request):
    authToken = None
    encoded = request.headers.get('authorization', None)
    #print(request.headers,'9999999999999999',encoded)
    if encoded:
        authToken = encoded.split('Bearer ')[1]
    return { "authToken": authToken }
