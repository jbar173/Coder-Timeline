# Generated by Django 3.1.6 on 2021-04-19 14:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210415_1546'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='start_date',
            new_name='created_at',
        ),
    ]