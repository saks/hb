# Generated by Django 2.0.2 on 2018-12-05 02:26

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budgets', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budget',
            name='tags',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(max_length=20), blank=True, default=[], size=None),
        ),
    ]
