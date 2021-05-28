from bitfield.forms import BitFieldCheckboxSelectMultiple


class TagsWidget(BitFieldCheckboxSelectMultiple):
    def _get_tags_dict(self, tags_list):
        tags_dict = {}

        for tag in tags_list:
            tags_dict[tag[1][0]['value']] = tag
        return tags_dict

    def get_context(self, name, value, attrs):
        context = super(TagsWidget, self).get_context(name, value, attrs)

        tags_weight = attrs.pop('user_tags_order', [])
        optgroups = context['widget']['optgroups']
        tags_dict = self._get_tags_dict(optgroups)

        reordered_optgroups = []
        for tag in tags_weight:
            reordered_optgroups.append(tags_dict.pop(tag))
        for tag, value in tags_dict.items():
            reordered_optgroups.append(value)

        context['widget']['optgroups'] = reordered_optgroups
        return context
