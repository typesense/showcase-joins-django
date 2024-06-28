import datetime
from django.db import models


def instance_to_document(instance):

    def format_value(field, value):
        formats = {
            models.DateField: lambda v: (
                int(datetime.datetime(v.year, v.month, v.day).timestamp())
                if v
                else None
            ),
            models.DateTimeField: lambda v: (
                int(datetime.datetime.strptime(v, "%Y-%m-%d").date().timestamp())
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
