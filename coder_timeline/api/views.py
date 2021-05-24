from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions, generics
from .serializers import (UserSerializer, AccountSerializer, ProjectSerializer,
                          ProjectSectionSerializer)
from .models import (Account, Project, ProjectSection)
from django.contrib.auth.models import User
import datetime
import json


# Create your views here.

@api_view(['GET',])
def apiOverview(request):
    api_urls = {
        'User list': '/user-list/',
        'User detail': '/user-detail/(?P<id>\d+)/',
        'Account detail':'/account-detail/(?P<acc_id>\d+)/',

        'Project list':'/p-list/',
        'Project detail':'/p-detail/(?P<proj_id>\d+)/',

        'Project section list':'/ps-list/(?P<proj_id>\d+)/',
        'Project section detail':'/ps-detail/(?P<proj_sec_id>\d+)/',

        'Create project':'/create-project/',
        'Update project':'/update-project/(?P<proj_id>\d+)/',
        'Delete project':'/delete-project/(?P<proj_id>\d+)/',
        'Create project section':'/create-ps/(?P<proj_id>\d+)/',
        'Update project section': '/update-ps/(?P<proj_sec_id>\d+)/',
        'Delete project section': '/delete-ps/(?P<proj_sec_id>\d+)/',
    }
    return Response(api_urls)



# POST
@api_view(['POST',])
def createProject(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    else:
        print("not valid")
        print(serializer.errors)
    return Response(serializer.data)


@api_view(['POST',])
def updateProject(request,proj_id):
    project = Project.objects.get(id=proj_id)
    x = request.data
    y = x.get('created_at')
    try:
        y = datetime.datetime.strptime(y,"%B %d, %Y").strftime("%Y-%m-%d")
        x['created_at'] = y
        serializer = ProjectSerializer(instance=project,data=x)
    except:
        serializer = ProjectSerializer(instance=project,data=request.data)
    if serializer.is_valid():
        serializer.save()
    else:
        print("not valid")
        print(serializer.errors)
    return Response(serializer.data)


@api_view(['POST',])
def createProjectSection(request,proj_id):
    serializer = ProjectSectionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    else:
        print("not valid")
        print(serializer.errors)
    return Response(serializer.data)


@api_view(['POST',])
def updateProjectSection(request,proj_sec_id):
    project_section = ProjectSection.objects.get(id=proj_sec_id)
    x = request.data
    y = x.get('date')
    try:
        y = datetime.datetime.strptime(y,"%B %d, %Y").strftime("%Y-%m-%d")
        x['date'] = y
        serializer = ProjectSectionSerializer(instance=project_section,data=x)
    except:
        serializer = ProjectSectionSerializer(instance=project_section,data=request.data)
    if serializer.is_valid():
        serializer.save()
    else:
        print("not valid")
        print(serializer.errors)
    return Response(serializer.data)



# GET
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request):
        queryset = self.get_queryset()
        serializer = UserSerializer(queryset, many=True)
        x = self.request.user.id
        y = {"user_list":""}
        z = dict(zip(y,serializer.data))
        z['current_id'] = x
        print(f"user id: {x}")
        return Response(z)
        # return Response(serializer.data)


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@api_view(['GET'])
def accountDetail(request,acc_username):
    account = Account.objects.get(username=acc_username)
    serializer = AccountSerializer(account,many=False)
    return Response(serializer.data)

@api_view(['GET'])
def projectDetail(request,proj_id):
    project = Project.objects.get(id=proj_id)
    serializer = ProjectSerializer(project,many=False)
    return Response(serializer.data)

@api_view(['GET'])
def projectSectionDetail(request,proj_sec_id):
    project_section = ProjectSection.objects.get(id=proj_sec_id)
    serializer = ProjectSectionSerializer(project_section,many=False)
    return Response(serializer.data)

@api_view(['GET'])
def projectList(request,acc_id):
    x =  Project.objects.all()
    projects = x.filter(account=acc_id).order_by('-created_at')
    serializer = ProjectSerializer(projects,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def projectSectionList(request,proj_id):
    x = ProjectSection.objects.all()
    project_sections = x.filter(project=proj_id).order_by('date')
    serializer = ProjectSectionSerializer(project_sections,many=True)
    return Response(serializer.data)


# DELETE
@api_view(['DELETE',])
def deleteProject(request,proj_id):
    project = Project.objects.get(id=proj_id)
    project_name = project.name
    project.delete()
    return Response(f"{project_name} deleted.")

@api_view(['DELETE',])
def deleteProjectSection(request,proj_sec_id):
    project_section = ProjectSection.objects.get(id=proj_sec_id)
    project_section_name = project_section.name
    project_section.delete()
    return Response(f"{project_section_name} deleted.")
