# Generated by Django 3.0.3 on 2020-02-26 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budgets', '0002_auto_20200225_1254'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='yearbudget',
            name='name',
            field=models.CharField(default='Year budget', max_length=100, verbose_name='Budget name'),
        ),
    ]
