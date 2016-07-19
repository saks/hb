from bitfield.forms import BitFieldCheckboxSelectMultiple
from bitfield.types import BitHandler

from django.forms.widgets import CheckboxFieldRenderer
from django.utils.html import conditional_escape, format_html, html_safe
from django.utils.safestring import mark_safe
from django.utils.encoding import (
    force_str, force_text, python_2_unicode_compatible,
)


class TagRenderer(CheckboxFieldRenderer):
    def __init__(self, name, value, attrs, choices):
        self.name = name
        self.value = value
        self.attrs = attrs
        self.choices = choices
        self.tags_weight = self.attrs.pop('user_tags_order', [])

    def render(self, name=None, value=None, attrs=None):
        """

        Outputs a <ul> for this set of ordered choice fields.
        If an id was given to the field, it is applied to the <ul> (each
        item in the list will get an id of `$id_$i`).
        """
        id_ = self.attrs.get('id')
        output = {}

        for i, choice in enumerate(sorted(self.choices)):
            choice_value, choice_label = choice
            if isinstance(choice_label, (tuple, list)):
                attrs_plus = self.attrs.copy()
                if id_:
                    attrs_plus['id'] += '_{}'.format(i)
                sub_ul_renderer = self.__class__(
                    name=self.name,
                    value=self.value,
                    attrs=attrs_plus,
                    choices=choice_label,
                )
                sub_ul_renderer.choice_input_class = self.choice_input_class
                output[choice[0]]=format_html(
                    self.inner_html, choice_value=choice_value,
                    sub_widgets=sub_ul_renderer.render(),
                )
            else:
                w = self.choice_input_class(self.name, self.value, self.attrs.copy(), choice, i)
                output[choice[0]]=format_html(self.inner_html, choice_value=force_text(w), sub_widgets='')

        # sort tags
        sorted_output = []
        for tag in self.tags_weight:
            sorted_output.append(output.pop(tag))
        rest_output = list(output.items())
        rest_output.sort(key=lambda x: x[0])
        sorted_output.extend([v for i, v in rest_output])

        return format_html(
            self.outer_html,
            id_attr=format_html(' id="{}"', id_) if id_ else '',
            content=mark_safe('\n'.join(sorted_output)),
)

class TagsWidget(BitFieldCheckboxSelectMultiple):
    renderer = TagRenderer

    def __init__(self, *args, **kwargs):
        super(TagsWidget, self).__init__(*args, **kwargs)
