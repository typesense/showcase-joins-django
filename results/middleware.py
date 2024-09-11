import typesense
from django.conf import settings


class TypesenseClientMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.client = typesense.Client(
            {
                "nodes": [
                    {
                        "host": settings.TYPESENSE_HOST,
                        "port": settings.TYPESENSE_PORT,
                        "protocol": settings.TYPESENSE_PROTOCOL,
                    }
                ],
                "api_key": settings.TYPESENSE_API_KEY,
                "connection_timeout_seconds": 2,
            }
        )

    def __call__(self, request):
        request.typesense = self.client
        response = self.get_response(request)
        return response
