# Generated by Django 2.0.2 on 2018-03-11 04:31

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budgets', '0004_auto_20180310_1441'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='budget',
            name='tags',
        ),
        migrations.AddField(
            model_name='budget',
            name='record_tags',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=20), blank=True, null=True, size=None),
        ),
    ]
