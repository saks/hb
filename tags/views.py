from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from userprofile.models import User


class TagsView(APIView):
    """
    A view that returns the count of active users in JSON.
    """
    renderer_classes = (JSONRenderer, )

    def get(self, request, format=None):  # return all tags
        return Response({'tags': request.user.get_ordered_tags()})

    def put(self, request, format=None):  # update list of all tags
        user = request.user

        user.tags = request.data['tags']
        user.save()

        return Response({'tags': user.get_ordered_tags()})
