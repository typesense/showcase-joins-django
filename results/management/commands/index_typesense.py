import datetime

from django.apps import apps
from django.core.management.base import BaseCommand
from django.db import models


class Command(BaseCommand):
    help = "Indexes the Typesense client for every model in the app"

    def handle(self, *args, **options):

        def instance_to_document(instance):

            def format_value(field, value):
                formats = {
                    models.DateField: lambda v: (
                        int(datetime.datetime(v.year, v.month, v.day).timestamp())
                        if v
                        else None
                    ),
                    models.DateTimeField: lambda v: (
                        int(
                            datetime.datetime.strptime(v, "%Y-%m-%d").date().timestamp()
                        )
                        if v
                        else None
                    ),
                    models.TimeField: lambda v: v.isoformat() if v else None,
                    models.ForeignKey: lambda v: str(v.id) if v else None,
                }

                for field_type, callback in formats.items():
                    if isinstance(field, field_type):
                        return callback(value)

                if field.name == "id":
                    return str(value)
                return value

            return {
                field.name: format_value(field, getattr(instance, field.name))
                for field in instance._meta.fields
            }

        # Get the app config
        app_config = apps.get_app_config("results")

        # Get the list of models
        model_list = app_config.get_models()

        # For each model, index the Typesense client
        for model in model_list:
            print("Indexing model: ", model.__name__)
            # Get all instances of the model
            instances = model.objects.all()

            document_list = [instance_to_document(instance) for instance in instances]
            print("Document list: ", len(document_list))
            collection_name = model.__name__.lower()
            print("Collection name: ", collection_name)

            try:
                import_results = app_config.client.collections[
                    collection_name
                ].documents.import_(document_list, {"action": "upsert"})
                unsuccessful_results = list(
                    filter(lambda result: not result["success"], import_results)
                )
                if unsuccessful_results:
                    print(unsuccessful_results)

            except Exception as e:
                print("Error indexing model: ", model.__name__)
                print(e)

        self.stdout.write("Successfully indexed Typesense client")
