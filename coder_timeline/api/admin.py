from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Account)
admin.site.register(models.GithubProject)
admin.site.register(models.Commit)
admin.site.register(models.Project)
admin.site.register(models.ProjectSection)
