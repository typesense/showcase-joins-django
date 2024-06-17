from django.db import models


class Driver(models.Model):
    id = models.AutoField(primary_key=True, db_column="driver_id")
    ref = models.CharField(max_length=255, db_column="driver_ref", null=True)
    number = models.IntegerField(null=True)
    code = models.CharField(max_length=3, null=True)
    forename = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    dob = models.DateField()
    nationality = models.CharField(max_length=255)
    url = models.URLField(max_length=200)


class Team(models.Model):
    id = models.AutoField(primary_key=True, db_column="teamId")
    ref = models.CharField(max_length=255, db_column="teamRef")
    name = models.CharField(max_length=255)
    nationality = models.CharField(max_length=255)
    url = models.URLField(max_length=200)


class Circuit(models.Model):
    id = models.AutoField(primary_key=True, db_column="circuit_id")
    ref = models.CharField(max_length=255, db_column="circuit_ref")
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    lat = models.FloatField()
    lng = models.FloatField()
    alt = models.IntegerField(null=True)
    url = models.URLField(max_length=200)


class Race(models.Model):
    id = models.AutoField(primary_key=True, db_column="race_id")
    year = models.IntegerField()
    round = models.IntegerField()
    circuit_id = models.ForeignKey(
        Circuit, on_delete=models.CASCADE, db_column="circuitId"
    )
    name = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField(null=True)
    url = models.URLField(max_length=200)
    fp1_date = models.DateField(null=True)
    fp1_time = models.TimeField(null=True)
    fp2_date = models.DateField(null=True)
    fp2_time = models.TimeField(null=True)
    fp3_date = models.DateField(null=True)
    fp3_time = models.TimeField(null=True)
    quali_date = models.DateField(null=True)
    quali_time = models.TimeField(null=True)
    sprint_date = models.DateField(null=True)
    sprint_time = models.TimeField(null=True)


class Status(models.Model):
    id = models.AutoField(primary_key=True, db_column="statusId")
    name = models.CharField(max_length=255, db_column="status")


class Result(models.Model):
    id = models.AutoField(primary_key=True, db_column="resultId")
    race_id = models.ForeignKey("Race", on_delete=models.CASCADE, db_column="raceId")
    driver_id = models.ForeignKey(
        "Driver", on_delete=models.CASCADE, db_column="driverId"
    )
    team_id = models.ForeignKey("Team", on_delete=models.CASCADE, db_column="teamId")
    number = models.IntegerField(null=True)
    grid = models.IntegerField()
    position = models.IntegerField(null=True)
    positionText = models.CharField(max_length=255, null=True)
    positionOrder = models.IntegerField()
    points = models.FloatField()
    laps = models.IntegerField()
    time = models.CharField(max_length=255, null=True)
    milliseconds = models.IntegerField(null=True)
    fastestLap = models.IntegerField(null=True)
    rank = models.IntegerField(null=True)
    fastestLapTime = models.CharField(max_length=255, null=True)
    fastestLapSpeed = models.CharField(max_length=255, null=True)
    status_id = models.ForeignKey(
        "Status", on_delete=models.CASCADE, db_column="statusId"
    )


class TeamResult(models.Model):
    id = models.AutoField(primary_key=True, db_column="teamResultsId")
    race_id = models.ForeignKey("Race", on_delete=models.CASCADE, db_column="raceId")
    team_id = models.ForeignKey("Team", on_delete=models.CASCADE, db_column="teamId")
    points = models.FloatField()
    status = models.CharField(max_length=255, null=True)


class DriverStanding(models.Model):
    id = models.AutoField(primary_key=True, db_column="driverStandingsId")
    race_id = models.ForeignKey("Race", on_delete=models.CASCADE, db_column="raceId")
    driver_id = models.ForeignKey(
        "Driver", on_delete=models.CASCADE, db_column="driverId"
    )
    points = models.FloatField()
    position = models.IntegerField()
    positionText = models.CharField(max_length=255)
    wins = models.IntegerField()


class TeamStanding(models.Model):
    id = models.AutoField(primary_key=True, db_column="teamStandingsId")
    race_id = models.ForeignKey("Race", on_delete=models.CASCADE, db_column="raceId")
    team_id = models.ForeignKey("Team", on_delete=models.CASCADE, db_column="teamId")
    points = models.FloatField()
    position = models.IntegerField()
    positionText = models.CharField(max_length=255)
    wins = models.IntegerField()


class SprintResult(models.Model):
    id = models.AutoField(primary_key=True, db_column="resultId")
    race_id = models.ForeignKey("Race", on_delete=models.CASCADE, db_column="raceId")
    driver_id = models.ForeignKey(
        "Driver", on_delete=models.CASCADE, db_column="driverId"
    )
    team_id = models.ForeignKey("Team", on_delete=models.CASCADE, db_column="teamId")
    number = models.IntegerField()
    grid = models.IntegerField()
    position = models.IntegerField(null=True)
    positionText = models.CharField(max_length=255, null=True)
    positionOrder = models.IntegerField()
    points = models.FloatField()
    laps = models.IntegerField()
    time = models.CharField(max_length=255, null=True)
    milliseconds = models.IntegerField(null=True)
    fastestLap = models.IntegerField(null=True)
    fastestLapTime = models.CharField(max_length=255, null=True)
    statusId = models.ForeignKey("Status", on_delete=models.CASCADE)
