# Generated by Django 2.0.2 on 2018-03-11 04:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0008_remove_record_tags'),
    ]

    operations = [
        migrations.RenameField(
            model_name='record',
            old_name='record_tags',
            new_name='tags',
        ),
    ]