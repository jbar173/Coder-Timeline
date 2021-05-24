from rest_framework import serializers
import datetime
from .models import (Account, Project, ProjectSection)
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):

    def to_representation(self, data):
        data = super(ProjectSerializer, self).to_representation(data)
        x = data.get('created_at')
        x = datetime.datetime.strptime(x,"%Y-%m-%d").strftime("%B %d, %Y")
        data['created_at'] = x
        return data

    class Meta:
        model = Project
        fields = '__all__'


class ProjectSectionSerializer(serializers.ModelSerializer):

    def to_representation(self, data):
        data = super(ProjectSectionSerializer, self).to_representation(data)
        x = data.get('date')
        x = datetime.datetime.strptime(x,"%Y-%m-%d").strftime("%B %d, %Y")
        data['date'] = x
        return data

    class Meta:
        model = ProjectSection
        fields = '__all__'
