from ariadne import ObjectType

from . import auth
from . import user
from . import forum
from . import thread

query = ObjectType("Query")

query.set_field("user",auth.resolve_login)
query.set_field("pubkey",auth.resolve_pubkey)
query.set_field("isAuthenticated",auth.resolve_isAuthenticated)
query.set_field("isAuthenticated1",auth.resolve_isAuthenticated1)
query.set_field("updateToken",auth.resolve_updateToken)
query.set_field("userProfile",user.resolve_userProfile)
query.set_field("isSuper",user.resolve_isSuper)
query.set_field("sections",forum.resolve_sections)
query.set_field("threads",thread.resolve_threads)
query.set_field("thread",thread.resolve_thread)
