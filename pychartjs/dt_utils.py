import datetime as dt
from dateutil.tz import gettz, tzoffset

def json_to_dt(obj):
    if obj.pop('__type__', None) != "datetime":
        return obj
    zone, offset = obj.pop("tz")
    obj["tzinfo"] = tzoffset(zone, offset)
    return dt.datetime(**obj)

def dt_to_json(obj):
    if isinstance(obj, dt.datetime):
        return {
            "__type__": "datetime",
            "year": obj.year,
            "month" : obj.month,
            "day" : obj.day,
            "hour" : obj.hour,
            "minute" : obj.minute,
            "second" : obj.second,
            "microsecond" : obj.microsecond,
            "tz": (obj.tzinfo.tzname(obj), obj.utcoffset().total_seconds())
        }
    else:
        raise TypeError("Cant serialize {}".format(obj))