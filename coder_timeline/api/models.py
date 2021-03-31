from django.db import models

# Create your models here.

class Account(models.Model):
    username = models.CharField(max_length=300,blank=False)

    def __str__(self):
        return self.username

class GithubProject(models.Model):
    account = models.ForeignKey(Account,on_delete=models.CASCADE,blank=False)
    name = models.CharField(max_length=100,blank=False)
    description = models.TextField()
    start_date = models.DateField()

    def __str__(self):
        return self.name

class Commit(models.Model):
    name = models.CharField(max_length=200,blank=False)
    date = models.DateField()
    github_project = models.ForeignKey(GithubProject,on_delete=models.CASCADE,blank=False)

    def __str__(self):
        return self.name

class Project(models.Model):
    account = models.ForeignKey(Account,on_delete=models.CASCADE,blank=False)
    name = models.CharField(max_length=100,blank=False)
    description = models.TextField()
    start_date = models.DateField()

    def __str__(self):
        return self.name

class ProjectSection(models.Model):
    name = models.CharField(max_length=200,blank=False)
    date = models.DateField()
    project = models.ForeignKey(Project,on_delete=models.CASCADE,blank=True)
    in_progress = models.BooleanField(default=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.name
