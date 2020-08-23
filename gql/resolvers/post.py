from django.forms.models import model_to_dict
from forum.models import Forum, Thread, Post, CustomUser, UserProfile
from utils.token import is_auth, is_super
from utils.user import get_user, get_userProfile


def resolve_postAct(_, info, action, **kwargs):
    actions = ['add','hide','delete']
    if not action in actions:
        return {'fail':True,'message':'Not allowed action'}

    '''check user'''
    isauth = is_auth(info.context)
    if isauth["isAuth"]:
        id = isauth["user"]
        try:
            user = CustomUser.objects.get(pk=id)
        except:
            return {'fail':True,'message':'User is not correct!'}
    else:
        return {'fail':True,'message':'User is not correct!'}
    #print(kwargs,'------',action)

    '''check thread'''
    if 'threadId' in kwargs:
        try:
            thread = Thread.objects.get(pk=kwargs['threadId'])
        except:
            return {'fail':True,'message':'thread is not correct!'}
    else:
        return {'fail':True,'message':'thread is not correct!'}


    if action == 'add':
        try:
            content = kwargs['content'] if 'content' in kwargs else ''
            Post.objects.create(content=content,creator=user,thread=thread)
            thread.inc_post();
            thread.update_active();
            forum = Forum.objects.get(id=thread.forum_id)
            forum.inc_post();
            #print(content)
            return {'fail':False,'message':''}
        except:
            return {'fail':True,'message':'add post failed!'}

    '''
    issuper = is_super(info.context)
    if issuper['isSuper']:

        if action == 'modify' or action == 'hide' or action == 'delete':
            if 'id' in kwargs:
                try:
                    section = Section.objects.get(pk=kwargs['id'])
                    if action == 'hide':
                        section.hide()
                        return {'fail':False,'message':''}
                    if action == 'delete':
                        section.delete()
                        return {'fail':False,'message':''}
                    if action == 'modify':
                        if 'name' in kwargs:
                            section.name = kwargs['name']
                        if 'description' in kwargs:
                            section.description = kwargs['description']
                        section.save()
                        return {'fail':False,'message':''}
                    return {'fail':True,'message':'Action wrong!'}
                except:
                    return {'fail':True,'message':'Section doesn\'t exists!'}
            else:
                return {'fail':True,'message':'Not valid section!'}
    else:
        return {'fail':True,'message':'No permission'}

def resolve_forumAct(_, info, action, **kwargs):
    #print(kwargs,'------',action)
    actions = ['add','modify','hide','delete']
    if not action in actions:
        return {'fail':True,'message':'Not allowed action'}

    issuper = is_super(info.context)
    if issuper['isSuper']:
        if action == 'add':
            if 'sectionId' in kwargs:
                try:
                    forum = Forum.objects.get(name=kwargs['name'])
                    return {'fail':True,'message':'Forum already exists!'}
                except:
                    des = kwargs['description'] if 'description' in kwargs else ''
                    Forum.objects.create(name=kwargs['name'],section_id=kwargs['sectionId'],description=des)
                    return {'fail':False,'message':''}
            else:
                return {'fail':True,'message':'Please choose the section!'}

        if action == 'modify' or action == 'hide' or action == 'delete':
            if 'id' in kwargs:
                try:
                    forum = Forum.objects.get(pk=kwargs['id'])
                    if action == 'hide':
                        forum.hide()
                        return {'fail':False,'message':''}
                    if action == 'delete':
                        forum.delete()
                        return {'fail':False,'message':''}
                    if action == 'modify':
                        if 'name' in kwargs:
                            forum.name = kwargs['name']
                        if 'description' in kwargs:
                            forum.description = kwargs['description']
                        forum.save()
                        return {'fail':False,'message':''}
                    return {'fail':True,'message':'Action wrong!'}
                except:
                    return {'fail':True,'message':'Section doesn\'t exists!'}
            else:
                return {'fail':True,'message':'Not valid section!'}
    else:
        return {'fail':True,'message':'No permission'}

    '''
