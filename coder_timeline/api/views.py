from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import models
from . import serializers


# Create your views here.

@api_view(['GET',])
def apiOverview(request):
    api_urls = {
        'Account timeline':'/account-timeline/(?P<acc_id>\d+)/',
        'Github project detail':'/ghp-detail/(?P<git_proj_id>\d+)/',
        'Github commit detail':'/ghpc-detail/(?P<com_id>\d+)/',
        'Project detail':'/p-detail/(?P<proj_id>\d+)/',
        'Project section detail':'/ps-detail/(?P<proj_sec_id>\d+)/',
        'Create project':'/create-project/(?P<acc_id>\d+)/',
        'Update project':'/update-project/(?P<proj_id>\d+)/',
        'Delete project':'/delete-project/(?P<proj_id>\d+)/',
        'Create project section':'/create-ps/(?P<proj_id>\d+)/',
        'Update project section': '/update-ps/(?P<proj_sec_id>\d+)/',
        'Delete project section': '/delete-ps/(?P<proj_sec_id>\d+)/',
    }
    return Response(api_urls)


# GET
@api_view(['GET'])
def accountDetail(request,acc_id):
    account = models.Account.objects.get(id=acc_id)
    serializer = serializers.AccountSerializer(account,many=False)
    return Response(serializer.data)

@api_view(['GET'])
def githubProjectDetail(request,git_proj_id):
    github_project = models.GithubProject.objects.get(id=git_proj_id)
    serializer = serializers.GithubProjectSerializer(github_project,many=False)
    return Response(serializer.data)

@api_view(['GET'])
def commitDetail(request,com_id):
    commit = models.Commit.objects.get(id=com_id)
    serializer = serializers.CommitSerializer(commit,many=False)
    return Response(serializer.data)



@api_view(['GET'])
def projectDetail(request,proj_id):
    project = models.Project.objects.get(id=proj_id)
    serializer = serializers.ProjectSerializer(project,many=False)
    return Response(serializer.data)

@api_view(['GET'])
def projectSectionDetail(request,proj_sec_id):
    project_section = models.ProjectSection.objects.get(id=proj_sec_id)
    serializer = serializers.ProjectSectionSerializer(project_section,many=False)
    return Response(serializer.data)



@api_view(['GET'])
def githubProjectList(request,acc_id):
    github_projects = models.GithubProject.objects.all().order_by('-start_date')
    serializer = serializers.GithubProjectSerializer(github_projects,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def commitList(request,git_proj_id):
    commits = models.Commit.objects.all().order_by('-date')
    serializer = serializers.CommitSerializer(commits,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def projectList(request,acc_id):
    projects = models.Project.objects.all().order_by('-start_date')
    serializer = serializers.ProjectSerializer(projects,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def projectSectionList(request,proj_id):
    project_sections = models.ProjectSection.objects.all().order_by('-date')
    serializer = serializers.ProjectSectionSerializer(project_sections,many=True)
    return Response(serializer.data)


### Timeline projects independent of GitHub (Create/Update/Delete): ###

# POST
@api_view(['POST',])
def createProject(request,acc_id):
    serializer = serializers.ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST',])
def updateProject(request,proj_id):
    project = models.Project.objects.get(id=proj_id)
    serializer = serializers.ProjectSerializer(instance=project,data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST',])
def createProjectSection(request,proj_id):
    serializer = serializers.ProjectSectionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST',])
def updateProjectSection(request,proj_sec_id):
    project_section = models.Project.objects.get(id=proj_sec_id)
    serializer = serializers.ProjectSectionSerializer(instance=project_section,data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


# DELETE
@api_view(['DELETE',])
def deleteProject(request,proj_id):
    project = models.Project.objects.get(id=proj_id)
    project_name = project.name
    project.delete()
    return (f"{project_name} deleted.")

@api_view(['DELETE',])
def deleteProjectSection(request,proj_sec_id):
    project_section = models.ProjectSection.objects.get(id=proj_sec_id)
    project_section_name = project_section.name
    project_section.delete()
    return (f"{project_section_name} deleted.")
