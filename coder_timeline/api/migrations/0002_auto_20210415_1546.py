# Generated by Django 3.1.6 on 2021-04-15 14:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='account',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='api.account'),
        ),
    ]
