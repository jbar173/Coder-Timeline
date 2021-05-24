from django.conf.urls import url
from . import views

app_name = 'api'

urlpatterns = [
    url(r'^$',views.apiOverview,name="api-overview"),
    url(r'^user-detail/(?P<pk>\d+)/$',views.UserDetail.as_view(),name="user-detail"),
    url(r'^account-detail/(?P<acc_username>[-\w]+)/$',views.accountDetail,name="account-detail"),
    # url(r'^ghp-detail/(?P<git_proj_id>\d+)/$',views.githubProjectDetail,name="ghp-detail"),
    # url(r'^ghpc-detail/(?P<com_id>\d+)/$',views.commitDetail,name="ghpc-detail"),

    url(r'^user-list/$',views.UserList.as_view(),name="user-list"),
    url(r'^p-list/(?P<acc_id>\d+)/$',views.projectList,name="p-list"),
    url(r'^p-detail/(?P<proj_id>\d+)/$',views.projectDetail,name="p-detail"),

    url(r'^ps-list/(?P<proj_id>\d+)/$',views.projectSectionList,name="ps-list"),
    url(r'^ps-detail/(?P<proj_sec_id>\d+)/$',views.projectSectionDetail,name="ps-detail"),

    url(r'^create-project/$',views.createProject,name="create-project"),
    url(r'^update-project/(?P<proj_id>\d+)/$',views.updateProject,name="update-project"),
    url(r'^delete-project/(?P<proj_id>\d+)/$',views.deleteProject,name="delete-project"),
    url(r'^create-ps/(?P<proj_id>\d+)/$',views.createProjectSection,name="create-ps"),
    url(r'^update-ps/(?P<proj_sec_id>\d+)/$',views.updateProjectSection,name="update-ps"),
    url(r'^delete-ps/(?P<proj_sec_id>\d+)/$',views.deleteProjectSection,name="delete-ps"),
]
