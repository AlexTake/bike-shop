class UseNotFoundException(BaseException):
    description = 'User does not exists'


class WrongPasswordException(BaseException):
    description = 'invalid password'


class UserAlreadyExist(BaseException):
    description = 'user with such login already exist'


class BookTestDriveIsImpossible(BaseException):
    description = 'car is already booked for test drive in chosen dealer center or user has planned test drive for ' \
                  'chosen date '
