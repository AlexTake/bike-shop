from abc import ABC, abstractmethod
import dto
import provider


class AbstractBikeService(ABC):
    _provider: provider.AbstractBikeProvider

    @abstractmethod
    def get_bikes(self) -> list[dto.Bike]:
        pass

    @abstractmethod
    def get_type_filter(self) -> list[dto.FilterItem]:
        pass

    @abstractmethod
    def get_firm_filter(self) -> list[dto.FilterItem]:
        pass

    @abstractmethod
    def get_bike_by_test_drive(self, test_drive_id) -> dto.Bike:
        pass


class BikeService(AbstractBikeService):
    def get_bike_by_test_drive(self, test_drive_id) -> dto.Bike:
        return self._provider.get_bike_by_test_drive(test_drive_id)

    def get_type_filter(self) -> list[dto.FilterItem]:
        return self._provider.get_filter_values(BikeService.__TYPE)

    def get_firm_filter(self) -> list[dto.FilterItem]:
        return self._provider.get_filter_values(BikeService.__FIRM)

    __FIRM = 'firm'
    __TYPE = 'type'

    def __init__(self):
        self._provider = provider.SqliteDataProvider.get_provider()

    def get_bikes(self) -> list[dto.Bike]:
        return self._provider.get_all_bikes()
