from django.forms.models import model_to_dict
from forum.models import Forum, Thread, Post, CustomUser, UserProfile
from utils.token import is_auth, is_super
from utils.user import get_user, get_userProfile

def resolve_threads(_, info, **kwargs):
    if 'forumName' in kwargs:
        forums = Forum.objects.filter(name=kwargs['forumName']).exclude(status='delete')
    else:
        return {'fail':True,'message':'Forum is not correct!'}

    if len(forums) > 1:
        return {'fail':True,'message':'Forum is not correct!'}


    issuper = is_super(info.context)
    forum = forums[0]

    if forum.status != 'active':
        if not issuper:
            return {'fail':True,'message':'Forum is not correct!'}

    if issuper:
        threads = Thread.objects.filter(forum=forum).exclude(status='delete').values()
    else:
        threads = Thread.objects.filter(forum=forum).exclude(status='delete').exclude(status='hide').values()

    for thread in threads:
        thread['content'] = None
        user_id = thread['creator_id']

        try:
            user = CustomUser.objects.get(pk=user_id)
            try:
                user_profile = UserProfile.objects.get(user=user)
            except:
                print('user profile doesn\'t exists!')
        except:
            print('user doesn\'t exists!')
        thread['creator'] = user_profile.nickname
        thread['avatar'] = user_profile.avatar

        if issuper:
            posts = Post.objects.filter(thread_id=thread['id']).exclude(status='delete')
        else:
            posts = Post.objects.filter(thread_id=thread['id']).exclude(status='delete').exclude(status='hide')

        if len(posts) > 0:
            thread['replies'] = len(posts)
            post = posts[len(posts)-1]
            pcreator_id = post.creator_id
            pcreator_profile = get_userProfile(None,pcreator_id)
            if pcreator_profile:
                thread['last_user'] = pcreator_profile.nickname
                thread['last_avatar'] = pcreator_profile.avatar
                thread['last_reply_at'] = post.created_at
                thread['last_reply_id'] = post.id
                #thread['last_reply'] = str(post)
            else:
                thread['last_user'] = None
                thread['last_avatar'] = None
                thread['last_reply_at'] = None
                thread['last_reply_id'] = None
                #thread['last_reply'] = None
        else:
            thread['replies'] = 0
            thread['last_user'] = thread['creator']
            thread['last_avatar'] = thread['avatar']
            thread['last_reply_at'] = thread['created_at']
            thread['last_reply_id'] = thread['id']
            #thread['last_reply'] = None

        #res.append(sec.values())
    #print(sections)
    #print(threads)
    return threads

def resolve_thread(_, info, **kwargs):

    if 'threadId' in kwargs:
        try:
            #thread = Thread.objects.get(pk=kwargs['threadId'])
            threads = Thread.objects.filter(pk=kwargs['threadId'])
        except:
            return {'fail':True,'message':'Thread is not correct!'}
    else:
        return {'fail':True,'message':'Forum is not correct!'}

    if len(threads) != 1:
        return {'fail':True,'message':'Thread is not correct!'}
    else:
        threads[0].inc_view()
        thread = threads.values()[0]

    issuper = is_super(info.context)

    if thread :
        if issuper and not thread['status'] == 'delete':
            pass
        else:
            return {'fail':True,'message':'Thread is prohibited!'}

        if 'currentPage' in kwargs and 'pageSize' in kwargs:
            currentPage = kwargs['currentPage']
            pageSize = kwargs['pageSize']
            start = (currentPage-1)*pageSize
            end = start + pageSize
        else:
            start = 0
            end = thread['nPost']

        if issuper:
            posts = Post.objects.filter(thread_id=thread['id']).exclude(status='delete')[start:end].values()
        else:
            posts = Post.objects.filter(thread_id=thread['id']).exclude(status='delete').exclude(status='hide')[start:end].values()

        user_id = thread['creator_id']
        forum_id = thread['forum_id']
        try:
            forum =  Forum.objects.get(pk=forum_id)
        except:
            return {'fail':True,'message':'Forum is not correct!'}

        if issuper and not forum.status == 'delete':
            pass
        else:
            return {'fail':True,'message':'Forum is prohibited!'}

        user_profile = get_userProfile(None,user_id)
        #print(thread['created_at'],'-------------')
        #thread = model_to_dict(thread)
        #thread['content'] = None
        if user_profile:
            thread['creator'] = user_profile.nickname
            thread['avatar'] = user_profile.avatar
        for post in posts:
            user_id = post['creator_id']
            user_profile = get_userProfile(None,user_id)
            if user_profile:
                post['creator'] = user_profile.nickname
                post['avatar'] = user_profile.avatar
        thread['posts'] = posts
        thread['fail'] = False
        thread['message'] = ''
        thread['forumName'] = forum.name
        #print(thread['created_at'],'==========')
        return thread
    return {'fail':True,'message':'Forum is not correct!'}


def resolve_threadAct(_, info, action, **kwargs):
    actions = ['new','hide','delete']
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

    '''check forum'''
    if 'forumName' in kwargs:
        try:
            forum = Forum.objects.get(name=kwargs['forumName'])
        except:
            return {'fail':True,'message':'Forum is not correct!'}
    else:
        return {'fail':True,'message':'Forum is not correct!'}


    if action == 'new':
        try:
            content = kwargs['content'] if 'content' in kwargs else ''
            thread = Thread.objects.create(title=kwargs['title'],content=content,creator=user,forum=forum)
            Post.objects.create(content=content,creator=user,thread=thread)
            forum.inc_thread();
            forum.inc_post();
            #print(content)
            return {'fail':False,'message':''}
        except:
            return {'fail':True,'message':'Create new thread failed!'}

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
