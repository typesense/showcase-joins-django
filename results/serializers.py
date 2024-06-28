from rest_framework import serializers

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = [
            "id",
            "ref",
            "number",
            "code",
            "forename",
            "surname",
            "dob",
            "nationality",
            "url",
        ]

    def create(self, validated_data):
        """
        Create and return a new `Driver` instance, given the validated data.
        """
        return Driver.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Driver` instance, given the validated data.
        """
        instance.ref = validated_data.get("ref", instance.ref)
        instance.number = validated_data.get("number", instance.number)
        instance.code = validated_data.get("code", instance.code)
        instance.forename = validated_data.get("forename", instance.forename)
        instance.surname = validated_data.get("surname", instance.surname)
        instance.dob = validated_data.get("dob", instance.dob)
        instance.url = validated_data.get("url", instance.url)
        instance.save()
        return instance
