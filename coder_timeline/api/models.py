from django.db import models
from django.conf import settings
from django.contrib import auth

# Create your models here.

class User(auth.models.User,auth.models.PermissionsMixin):

    def __str__(self):
        return "@{}".format(self.username)


class Account(models.Model):
    username = models.CharField(max_length=300,blank=False)

    def __str__(self):
        return self.username


class Project(models.Model):
    account = models.ForeignKey(Account,on_delete=models.CASCADE,blank=True)
    name = models.CharField(max_length=100,blank=False)
    description = models.TextField()
    created_at = models.DateField()
    sections = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class ProjectSection(models.Model):
    name = models.CharField(max_length=200,blank=False)
    date = models.DateField()
    project = models.ForeignKey(Project,on_delete=models.CASCADE,blank=True,related_name='ps')
    in_progress = models.BooleanField(default=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.name
