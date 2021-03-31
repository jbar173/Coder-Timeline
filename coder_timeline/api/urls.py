from django.conf.urls import url
from . import views

app_name = 'api'

urlpatterns = [
    url(r'^$',views.apiOverview,name="api-overview"),
    url(r'^account-timeline/(?P<acc_id>\d+)/$',views.accountDetail,name="account-timeline"),
    url(r'^ghp-detail/(?P<git_proj_id>\d+)/$',views.githubProjectDetail,name="ghp-detail"),
    url(r'^ghpc-detail/(?P<com_id>\d+)/$',views.commitDetail,name="p-detail"),
    url(r'^p-detail/(?P<proj_id>\d+)/$',views.projectDetail,name="account-timeline"),
    url(r'^ps-detail/(?P<proj_sec_id>\d+)/$',views.projectSectionDetail,name="ps-detail"),
    url(r'^create-project/(?P<acc_id>\d+)/$',views.createProject,name="create-project"),
    url(r'^update-project/(?P<proj_id>\d+)/$',views.updateProject,name="update-project"),
    url(r'^delete-project/(?P<proj_id>\d+)/$',views.deleteProject,name="delete-project"),
    url(r'^create-ps/(?P<proj_id>\d+)/$',views.createProjectSection,name="create-ps"),
    url(r'^update-ps/(?P<proj_sec_id>\d+)/$',views.updateProjectSection,name="update-ps"),
    url(r'^delete-ps/(?P<proj_sec_id>\d+)/$',views.deleteProjectSection,name="delete-ps"),
]
