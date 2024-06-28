import csv
from pathlib import Path
from typing import Any

from django.core.management import BaseCommand
from django.db import transaction

from results.models import (
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

MODELS_AND_FILES = {
    Driver: "drivers.csv",
    Team: "constructors.csv",
    Circuit: "circuits.csv",
    Status: "status.csv",
    Race: "races.csv",
    Result: "results.csv",
    TeamResult: "constructor_results.csv",
    DriverStanding: "driver_standings.csv",
    SprintResult: "sprint_results.csv",
    TeamStanding: "constructor_standings.csv",
}


def load_data_from_csv(model, file_path):
    instances = []
    with open(file_path, "r", encoding="utf-8") as file:
        reader = csv.reader(file, delimiter=",")
        headers = next(reader, None)  # get the headers
        for row in reader:
            row = [
                (
                    float(value)
                    if headers[index] in ["lat", "lng"]
                    else (
                        int(value)
                        if value.isdigit()
                        else (value if value != "\\N" else None)
                    )
                )
                for index, value in enumerate(row)
            ]
            instance = model(*row)
            instances.append(instance)

    with transaction.atomic():
        model.objects.bulk_create(instances)


class Command(BaseCommand):
    current_file = Path(__file__).resolve().parent
    races_file = current_file / "drivers.csv"

    def handle(self, *args: Any, **options: Any) -> str | None:
        for model, file in MODELS_AND_FILES.items():
            print(f"Loading data for {model}")
            file_path = self.current_file / file
            load_data_from_csv(model, file_path)
