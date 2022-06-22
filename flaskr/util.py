class DateUtil:
    @staticmethod
    def truncate_to_day(timestamp: int) -> int:
        return int((timestamp / 86400) * 86400)
