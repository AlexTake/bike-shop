from abc import ABC, abstractmethod
import provider
import dto


class AbstractDealerService(ABC):
    _provider: provider.AbstractDealerCenterProvider

    @abstractmethod
    def get_dealer_centers(self) -> list[dto.DealerCenter]:
        pass

    @abstractmethod
    def get_dealer_center_by_bike(self, car_id) -> list[dto.DealerCenter]:
        pass

    @abstractmethod
    def get_booked_dates(self, car_id, dealer_center_id) -> list[int]:
        pass


class DealerService(AbstractDealerService):
    def get_booked_dates(self, car_id, dealer_center_id) -> list[int]:
        return self._provider.get_booked_bikes(car_id, dealer_center_id)

    def get_dealer_center_by_bike(self, car_id) -> list[dto.DealerCenter]:
        return self._provider.get_dealer_centers_by_bike(car_id)

    def get_dealer_centers(self) -> list[dto.DealerCenter]:
        return self._provider.get_centers()

    def __init__(self):
        self._provider = provider.SqliteDataProvider.get_provider()
