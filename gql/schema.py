from ariadne import load_schema_from_path, ObjectType, MutationType
from ariadne import make_executable_schema, upload_scalar, fallback_resolvers
from .resolvers import *


type_defs = load_schema_from_path("gql/schemas/")


schema = make_executable_schema(type_defs,query,mutation,upload_scalar,fallback_resolvers)
