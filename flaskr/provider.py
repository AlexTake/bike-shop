from abc import ABC, abstractmethod
import dto
import sqlite3
import converter


class SqliteDatabaseProvider:
    def execute_select(self, query: str):
        connection = sqlite3.connect('./data.db')
        cursor = connection.cursor()
        cursor.execute(query)
        records = cursor.fetchall()
        cursor.close()
        connection.close()
        return records

    def execute_update(self, query):
        connection = sqlite3.connect('./data.db')
        cursor = connection.cursor()
        cursor.execute(query)
        res = cursor.fetchall()
        connection.commit()
        cursor.close()
        connection.close()
        return res


class AbstractClientProvider(ABC):
    @abstractmethod
    def is_login_exist(self, login: str) -> bool:
        pass

    @abstractmethod
    def check_password(self, login: str, password: str) -> bool:
        pass

    @abstractmethod
    def get_client(self, login: str) -> dto.Client:
        pass

    @abstractmethod
    def register_new_user(self, login: str, password: str):
        pass


class AbstractBikeProvider(ABC):
    @abstractmethod
    def get_all_bikes(self) -> list[dto.Bike]:
        pass

    @abstractmethod
    def get_filter_values(self, filter_name: str) -> list[dto.FilterItem]:
        pass

    @abstractmethod
    def get_bike_by_test_drive(self, test_drive_id) -> dto.Bike:
        pass


class AbstractTestDriveProvider(ABC):
    @abstractmethod
    def create_test_drive(self, car_id: int, date: int, client_id: int, dealer_center_id: int):
        pass

    @abstractmethod
    def check_possibility(self, car_id: int, date: int, client_id: int, dealer_center_id: int) -> bool:
        pass

    @abstractmethod
    def get_test_drives_by_client(self, client_id: int) -> list[dto.TestDrive]:
        pass

    @abstractmethod
    def complete(self, test_drive_id: int):
        pass


class AbstractDealerCenterProvider(ABC):
    @abstractmethod
    def get_centers(self):
        pass

    @abstractmethod
    def get_dealer_centers_by_bike(self, bike_id: int):
        pass

    @abstractmethod
    def get_booked_bikes(self, bike_id: int, dealer_center_id: int):
        pass


class SqliteDataProvider(AbstractClientProvider, AbstractBikeProvider, AbstractTestDriveProvider,
                         AbstractDealerCenterProvider):
    _provider = None

    def __init__(self):
        self._db = SqliteDatabaseProvider()

    @classmethod
    def get_provider(cls):
        if not cls._provider:
            cls._provider = SqliteDataProvider()
        return cls._provider

    def get_bike_by_test_drive(self, test_drive_id) -> dto.Bike:
        sql = f'''SELECT b.id , t.name, f.name ,b.model ,b.frame , b.seat, b.brakes, b."chain", b.image 
from bike b 
join firm f on b.firmid = f.id 
join type t on t.id = b.typeid
join testdrives td on td.autoid = b.id
where td.id = {test_drive_id};
        '''

        return converter.DbResponseToBikeConverter().convert(data=self._db.execute_select(sql)[0])

    def get_dealer_centers_by_bike(self, bike_id: int):
        sql = f'''SELECT d.*
from dillercenter d 
join dillercenterbike d2 on d.id = d2.dillercenterid 
where d2.bikeid = {bike_id}'''

        return [converter.DbResponseToDealerCenterConverter().convert(data=item) for item in
                self._db.execute_select(sql)]

    def is_login_exist(self, login: str) -> bool:
        sql = f'''
        SELECT EXISTS (
	SELECT c.id
	from client c 
	where c.login = '{login}'
);
        '''
        res = self._db.execute_select(sql)
        return bool(int(res[0][0]))

    def check_password(self, login: str, password: str) -> bool:
        sql = f'''SELECT c.password = '{password}'
FROM client c 
WHERE c.login = '{login}';
'''
        res = self._db.execute_select(sql)
        return bool(int(res[0][0]))

    def get_client(self, login: str) -> dto.Client:
        sql = f'''
        SELECT c.id , c.login , c.password 
from client c 
where c.login = '{login}' or c.id = '{login}';
'''
        return converter.DbResponseToClientConverter().convert(data=self._db.execute_select(sql)[0])

    def register_new_user(self, login: str, password: str) -> dto.Client:
        sql = f'''
        INSERT INTO client (login, password) VALUES
("{login}", "{password}")
        '''
        self._db.execute_update(sql)
        return self.get_client(login)

    def get_all_bikes(self) -> list[dto.Bike]:
        sql = '''SELECT b.id , t.name, f.name ,b.model ,b.frame , b.seat, b.brakes, b."chain", b.image 
from bike b 
join firm f on b.firmid = f.id 
join type t on t.id = b.typeid;'''

        res = self._db.execute_select(sql)
        return [converter.DbResponseToBikeConverter().convert(data=row) for row in res]

    def check_possibility(self, car_id: int, date: int, client_id: int, dealer_center_id: int) -> bool:
        sql = f'''SELECT EXISTS (
select id  
from testdrives t 
where ( (t.autoid = {car_id} and t.dillercenterid = {dealer_center_id} ) or t.clientid = {client_id})
and t.testdrivedate = {date})
and EXISTS(
SELECT id from dillercenterbike d where d.dillercenterid = {dealer_center_id} and d.bikeid = {car_id}
)
        '''
        res = self._db.execute_select(sql)
        return bool(int(res[0][0]))

    def create_test_drive(self, car_id: int, date: int, client_id: int, dealer_center_id: int):
        sql = f'''INSERT INTO testdrives(autoid, testdrivedate, clientid, dillercenterid) VALUES
({car_id}, {date}, {client_id}, {dealer_center_id});'''

        self._db.execute_update(sql)

    def get_test_drives_by_client(self, client_id: int) -> list[dto.TestDrive]:
        sql = f'''SELECT t.id, f.name || ' ' || a.model, t.testdrivedate, d.name || ', ' || d.address,
t.status
from testdrives t 
join bike a ON a.id = t.autoid 
join firm f ON f.id = a.firmid 
join dillercenter d on d.id = t.dillercenterid
where t.clientid = {client_id}'''

        return [converter.DbResponseToTestDriveConverter().convert(data=item) for item in self._db.execute_select(sql)]

    def get_filter_values(self, filter_name: str) -> list[dto.FilterItem]:
        sql = f'''SELECT * from {filter_name}'''

        return [converter.DbResponseToFilterConverter().convert(data=item) for item in self._db.execute_select(sql)]

    def get_centers(self):
        sql = 'SELECT * from dillercenter'

        return [converter.DbResponseToDealerCenterConverter().convert(data=item) for item in
                self._db.execute_select(sql)]

    def complete(self, test_drive_id: int):
        sql = f'update testdrives set status = True where id = {test_drive_id}'

        self._db.execute_update(sql)

    def get_booked_bikes(self, bike_id: int, dealer_center_id: int) -> list[int]:
        sql = f'''SELECT t.testdrivedate 
from testdrives t 
where cast(STRFTIME('%s', 'now') AS UNSIGNED BIG INT) < t.testdrivedate 
and t.autoid = {bike_id} and t.dillercenterid = {dealer_center_id}
'''
        return [int(item[0]) for item in self._db.execute_select(sql)]
