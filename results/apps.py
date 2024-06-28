import datetime
import pdb

import typesense
from dateutil.parser import parse
from django.apps import AppConfig, apps
from django.conf import settings
from django.db import models
from django.dispatch import receiver


class ResultsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "results"

    def ready(self):
        from .models import (
            Circuit,
            Driver,
            DriverStanding,
            Race,
            Result,
            SprintResult,
            Status,
            Team,
            TeamResult,
            TeamStanding,
        )

        model_list = [
            Circuit,
            Team,
            Driver,
            Race,
            Result,
            Status,
            SprintResult,
            TeamStanding,
            TeamResult,
            DriverStanding,
        ]

        # Initialize the Typesense client
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

        print("Typesense client initialized")

        def model_to_schema(model):
            def django_field_to_typesense_field(field):
                # Typesense uses its own id and will ignore it regardless, you can write to it afterwards
                if field.name == "id":
                    return {
                        "name": field.name,
                        "type": "string",
                        "index": False,
                    }

                field_type_to_dict = {
                    models.ForeignKey: lambda: {
                        "name": field.name,
                        "type": "string",  # Assuming the foreign key is an integer
                        "reference": f"{field.related_model.__name__.lower()}.id",
                    },
                    models.CharField: lambda: {
                        "name": field.name,
                        "type": "string",
                        "sort": True,
                        "facet": True,
                    },
                    models.TextField: lambda: {
                        "name": field.name,
                        "type": "string",
                        "sort": True,
                        "facet": True,
                    },
                    models.IntegerField: lambda: {
                        "name": field.name,
                        "type": "int32",
                        "facet": True,
                    },
                    models.FloatField: lambda: {"name": field.name, "type": "float"},
                    models.DecimalField: lambda: {"name": field.name, "type": "float"},
                    models.DateField: lambda: {
                        "name": field.name,
                        "type": "int64",
                        "facet": True,
                    },  # Typesense doesn't have a date type, so we use unix timestamp
                    models.DateTimeField: lambda: {
                        "name": field.name,
                        "type": "int64",
                        "facet": True,
                    },  # Typesense doesn't have a date type, so we use unix timestamp
                }

                if type(field) in field_type_to_dict:
                    field_dict = field_type_to_dict[type(field)]()

                else:  # Default to auto for other field types
                    field_dict = {"name": field.name, "type": "auto"}

                if field.null:
                    field_dict["optional"] = True

                return field_dict

            return {
                "name": model.__name__.lower(),
                "fields": [
                    django_field_to_typesense_field(field)
                    for field in model._meta.fields
                    if django_field_to_typesense_field(field)
                ],
            }

        for model in model_list:
            collection_name = model.__name__.lower()
            try:
                collection = self.client.collections[collection_name].retrieve()
                print(f"Collection {collection_name} already exists")
            # If the collection does not exist, create it
            except:
                print(f"Creating collection {collection_name}...")
                self.client.collections.create(model_to_schema(model))
