from forum.models import Section, Forum, Thread, Post
from utils.token import is_auth, is_super
from utils.user import get_userProfile

def get_forum_summary(sectionId,issuper):
    if issuper:
        forums = Forum.objects.filter(section_id=sectionId).exclude(status='delete').values()
    else:
        forums = Forum.objects.filter(section_id=sectionId).exclude(status='delete').exclude(status='hide').values()
    for forum in forums:
        if issuper:
            threads = Thread.objects.filter(forum_id=forum['id']).exclude(status='delete').values()
        else:
            threads = Thread.objects.filter(forum_id=forum['id']).exclude(status='delete').exclude(status='hide').values()
        if len(threads) > 0:
            thread = threads[0]
            forum['thread'] = thread['title']
            forum['thread_id'] = thread['id']
            forum['thread_last_activity'] = thread['last_activity']
            if issuper:
                posts = Post.objects.filter(thread_id=thread['id']).exclude(status='delete').values()
            else:
                posts = Post.objects.filter(thread_id=thread['id']).exclude(status='delete').exclude(status='hide').values()
            if len(posts) > 0:
                post = posts[0]
                pcreator_profile = get_userProfile(None,post['creator_id'])
                forum['last_user'] = pcreator_profile.nickname
                forum['last_avatar'] = pcreator_profile.avatar
                forum['last_post_id'] = post['id']
    return forums

def resolve_sections(_, info, **kwargs):
    issuper = is_super(info.context)
    res = []
    if issuper:
        sections = Section.objects.all().exclude(status='delete').values()
        for sec in sections:
            forums = get_forum_summary(sec['id'],True)
            sec['forums'] = forums
    else:
        sections = Section.objects.all().exclude(status='delete').exclude(status='hide').values()
        for sec in sections:
            forums = Forum.objects.filter(section_id=sec['id']).exclude(status='delete').exclude(status='hide').values()
            forums = get_forum_summary(sec['id'],False)
            sec['forums'] = forums
        #res.append(sec.values())
    #print(sections)
    return sections

def resolve_sectionAct(_, info, action, **kwargs):
    #print(kwargs,'------',action)
    actions = ['add','modify','hide','delete']
    if not action in actions:
        return {'fail':True,'message':'Not allowed action'}

    issuper = is_super(info.context)
    if issuper['isSuper']:
        if action == 'add':
            try:
                section = Section.objects.get(name=kwargs['name'])
                return {'fail':True,'message':'Section already exists!'}
            except:
                des = kwargs['description'] if 'description' in kwargs else ''
                Section.objects.create(name=kwargs['name'],description=des)
                return {'fail':False,'message':''}

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
