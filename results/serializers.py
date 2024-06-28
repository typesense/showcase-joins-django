from rest_framework import serializers

from .models import Circuit, Driver, Team


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "ref", "name", "nationality", "url"]

    def create(self, validated_data):
        """
        Create and return a new `Team` instance, given the validated data.
        """
        return Team.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Team` instance, given the validated data.
        """
        instance.ref = validated_data.get("ref", instance.ref)
        instance.name = validated_data.get("name", instance.name)
        instance.nationality = validated_data.get("nationality", instance.nationality)
        instance.url = validated_data.get("url", instance.url)
        instance.save()
        return instance


class CircuitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Circuit
        fields = [
            "id",
            "ref",
            "name",
            "location",
            "country",
            "lat",
            "lng",
            "alt",
            "url",
        ]

    def create(self, validated_data):
        """
        Create and return a new `Circuit` instance, given the validated data.
        """
        return Circuit.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Circuit` instance, given the validated data.
        """
        instance.name = validated_data.get("name", instance.name)
        instance.ref = validated_data.get("ref", instance.ref)
        instance.location = validated_data.get("location", instance.location)
        instance.country = validated_data.get("country", instance.country)
        instance.lat = validated_data.get("lat", instance.lat)
        instance.lng = validated_data.get("lng", instance.lng)
        instance.alt = validated_data.get("alt", instance.alt)
        instance.url = validated_data.get("url", instance.url)
        instance.save()
        return instance


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
