from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver

from records.models import Record


@receiver(pre_save, sender=Record, dispatch_uid='records_update_tags_weight')
def update_tags_weight(sender, **kwargs):
    '''
        Update frequency of tags usage.
    '''
    instance = kwargs['instance']
    _tags_updated = False

    # remove weights if update
    if instance.pk:
        orig = sender.objects.get(pk=instance.pk)
        if orig.tags != instance.tags:
            _tags_updated = True
            orig.remove_tags_weights()

    # add tags weight on create or update tags
    if not instance.pk or _tags_updated:
        instance.add_tags_weights()


@receiver(pre_delete, sender=Record, dispatch_uid='records_delete_tags_weight')
def delete_tags_weight(sender, **kwargs):
    '''
    Singnal to remove tags for correct ordering by frequency of usage.
    '''
    instance = kwargs['instance']
    instance.remove_tags_weights()
