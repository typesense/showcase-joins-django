from django.apps import apps
from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Circuit, Driver, Team
from .serializers import CircuitSerializer, DriverSerializer, TeamSerializer


def get_query_parameters(request):
    return request.query_params.dict()


def validate_query_parameters(parameters, fields):
    query = parameters.get("q", None)
    query_by = parameters.get("query_by", None)

    if query is None:
        raise ValueError("Query parameter 'q' is required")

    if query_by is None:
        raise ValueError("Query parameter 'query_by' is required")

    string_fields = [field["name"] for field in fields if field["type"] == "string"]

    if query_by not in string_fields:
        raise ValueError(
            f"Invalid 'query_by' parameter. It must be one of {string_fields}"
        )

    return query, query_by


def get_sortable_fields(fields):
    sortable_data_types = {
        "string",
        "int32",
        "float32",
        "int64",
        "float64",
        "boolean",
    }

    maybe_sortable_fields = [
        field for field in fields if field["type"] in sortable_data_types
    ]

    sortable_fields = [
        field["name"]
        for field in maybe_sortable_fields
        if field["type"] != "string"
        or (field["type"] == "string" and field["sort"] == True)
    ]

    return sortable_fields


def validate_sort_parameters(parameters, sortable_fields):
    sort_by = parameters.get("sort_by", None)

    if sort_by:
        sort_by = sort_by.split(":")
        sort_order = sort_by[1] if len(sort_by) > 1 else None
        sort_field = sort_by[0] if sort_by else None

        if sort_field not in sortable_fields:
            raise ValueError(
                f"Invalid 'sort_by' parameter. It must be one of {sortable_fields}"
            )

        if sort_order not in ["asc", "desc"]:
            raise ValueError(
                f"Invalid 'sort_by' parameter. It must be one of ['asc', 'desc']"
            )

    return sort_by


def search_documents(client, collection_name, parameters):
    return client.collections[collection_name].documents.search(parameters)


class CircuitSearch(APIView):
    client = apps.get_app_config("results").client

    def get(self, request):
        try:
            parameters = get_query_parameters(request)
            collection = self.client.collections["circuit"].retrieve()
            fields = collection["fields"]

            validate_query_parameters(parameters, fields)
            sortable_fields = get_sortable_fields(fields)
            validate_sort_parameters(parameters, sortable_fields)

            result = search_documents(self.client, "circuit", parameters)

            return Response(result)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CircuitList(generics.ListAPIView):
    queryset = Circuit.objects.all()
    serializer_class = CircuitSerializer


class CircuitDetail(generics.RetrieveAPIView):
    queryset = Circuit.objects.all()
    serializer_class = CircuitSerializer


class DriverSearch(APIView):
    client = apps.get_app_config("results").client

    def get(self, request):
        try:
            parameters = get_query_parameters(request)
            collection = self.client.collections["driver"].retrieve()
            fields = collection["fields"]

            validate_query_parameters(parameters, fields)
            sortable_fields = get_sortable_fields(fields)
            validate_sort_parameters(parameters, sortable_fields)

            result = search_documents(self.client, "driver", parameters)

            return Response(result)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DriverList(generics.ListAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer


class DriverDetail(generics.RetrieveAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer


class TeamSearch(APIView):
    client = apps.get_app_config("results").client

    def get(self, request):
        try:
            parameters = get_query_parameters(request)
            collection = self.client.collections["team"].retrieve()
            fields = collection["fields"]

            validate_query_parameters(parameters, fields)
            sortable_fields = get_sortable_fields(fields)
            validate_sort_parameters(parameters, sortable_fields)

            result = search_documents(self.client, "team", parameters)

            return Response(result)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeamList(generics.ListAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class TeamDetail(generics.RetrieveAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
