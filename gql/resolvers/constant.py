LOGO = 'media/logo.jpg'

USERADD = ["nickname","avatar"]

PRIVATEKEY = "pairs/rsa_2048_priv.pem"
PUBLICKEY = "pairs/rsa_2048_pub.pem"

ENCODEDVARS = "encodedVars"

AUTHTOKEN = "authToken"
REFRESHTOKEN = "refreshToken"
#seconds live life of auth token
AUTHTOKEN_TIMEDELTA = 600
#days live lif of refresh token
REFRESHTOKEN_TIMEDELTA = 3
#minuts update before expire authtoken
AUTHTOKEN_UPDATEDELTA = 2
#minuts update before expire refreshtoken
REFRESHTOKEN_UPDATEDELTA = 3

TOKENALG = 'HS256'

SUPERGROUP = "Super User"
