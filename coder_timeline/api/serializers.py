from rest_framework import serializers
import datetime
from . import models

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Account
        fields = '__all__'

class GithubProjectSerializer(serializers.ModelSerializer):

    def to_representation(self, data):
        data = super(GithubProjectSerializer, self).to_representation(data)
        x = data.get('start_date')
        x = datetime.datetime.strptime(x,"%Y-%m-%d").strftime("%B %d, %Y")
        data['start_date'] = x
        return data

    class Meta:
        model = models.GithubProject
        fields = '__all__'

class CommitSerializer(serializers.ModelSerializer):

    def to_representation(self, data):
        data = super(CommitSerializer, self).to_representation(data)
        x = data.get('date')
        x = datetime.datetime.strptime(x,"%Y-%m-%d").strftime("%B %d, %Y")
        data['date'] = x
        return data

    class Meta:
        model = models.Commit
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):

    def to_representation(self, data):
        data = super(ProjectSerializer, self).to_representation(data)
        x = data.get('start_date')
        x = datetime.datetime.strptime(x,"%Y-%m-%d").strftime("%B %d, %Y")
        data['start_date'] = x
        return data

    class Meta:
        model = models.Project
        fields = '__all__'

class ProjectSectionSerializer(serializers.ModelSerializer):

    def to_representation(self, data):
        data = super(ProjectSectionSerializer, self).to_representation(data)
        x = data.get('date')
        x = datetime.datetime.strptime(x,"%Y-%m-%d").strftime("%B %d, %Y")
        data['date'] = x
        return data

    class Meta:
        model = models.ProjectSection
        fields = '__all__'
