from ariadne import ObjectType
from . import auth
from . import user
from . import forum
from . import thread
from . import post

mutation = ObjectType("Mutation")

mutation.set_field("login",auth.resolve_login)
mutation.set_field("register",auth.resolve_register)
mutation.set_field("resetPassword",auth.resolve_resetPassword)
mutation.set_field("updateSetting",user.resolve_updateSetting)
mutation.set_field("sectionAct",forum.resolve_sectionAct)
mutation.set_field("threadAct",thread.resolve_threadAct)
mutation.set_field("postAct",post.resolve_postAct)
