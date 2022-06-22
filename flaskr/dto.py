from dataclasses import dataclass

from flask_login import UserMixin


class Client(UserMixin):
    def __init__(self, client_id=-1, login="", password=""):
        self._password = password
        self._login = login
        self._id = client_id

    @property
    def id(self) -> int:
        return self._id

    @property
    def password(self) -> str:
        return self._password

    @property
    def login(self) -> str:
        return self._login


@dataclass()
class Bike:
    id: int
    type: str
    firm: str
    model: str
    frame: str
    seat: str
    brakes: str
    chain: str
    image: str

    def to_dict(self) -> dict:
        return self.__dict__


class TestDrive:
    def __init__(self, td_id=0, car='', time=0, dealer_center='', status=False):
        self._car = car
        self._date = time
        self._dealer_center = dealer_center
        self._status = status
        self._id = td_id

    @property
    def id(self) -> int:
        return self._id

    @property
    def car(self) -> str:
        return self._car

    @property
    def time(self) -> int:
        return self._date

    @property
    def dealer_center(self) -> str:
        return self._dealer_center

    @property
    def status(self) -> bool:
        return self._status

    def to_dict(self) -> dict:
        return {
            'id': self._id,
            'car': self._car,
            'date': self._date,
            'dealer_center': self._dealer_center,
            'status': self._status
        }


class FilterItem:
    def __init__(self, id=-1, name=''):
        self._id = id
        self._name = name

    @property
    def id(self) -> int:
        return self._id

    @property
    def name(self) -> str:
        return self._name

    def to_dict(self) -> dict:
        return {
            "id": self._id,
            "name": self._name
        }


class DealerCenter:
    def __init__(self, center_id=0, name='', address=''):
        self._id = center_id
        self._name = name
        self._address = address

    @property
    def id(self) -> int:
        return self._id

    @property
    def name(self) -> str:
        return self._name

    @property
    def address(self) -> str:
        return self._address

    def to_dict(self) -> dict:
        return {
            'id': self._id,
            'name': self._name,
            'address': self.address
        }
