# Generated by Django 2.0.2 on 2018-03-10 22:41

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0004_auto_20171106_0159'),
    ]

    operations = [
        migrations.AddField(
            model_name='record',
            name='record_tags',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=20), null=True, size=None),
        ),
    ]