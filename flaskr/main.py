from flask import Flask, request, abort, jsonify
from flask_cors import CORS

from setup import init_app
from clientService import ClientService
from bikeService import BikeService
from testDriveService import TestDriveService
from dealerService import DealerService
from flask_login import login_user, logout_user, login_required, current_user
import error

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*", "supports_credentials": "true"}})
init_app(app)


@app.route('/api/login', methods=['POST'])
def login():
    """
    takes json: {
    "login":"user_email_or_phone_number",
    "password":"user_password"
    }

    creates user session
    :return: success or error
    """
    userdata = request.json['login']
    password = request.json['password']

    if not (userdata and password):
        abort(400, 'required field empty')

    cs = ClientService()
    try:
        user = cs.login(userdata, password)
        login_user(user)
    except (error.UseNotFoundException, error.WrongPasswordException) as er:
        abort(401, er.description)

    return jsonify(success=True)


@app.route('/api/logout')
@login_required
def logout():
    """
       ends user session
       :return: 200 ok
    """
    logout_user()
    return jsonify(success=True)


@app.route('/api/sing-up', methods=['POST'])
def sing_up():
    """
       takes json: {
       "email":"",  //field does not required
       "password":"",
       "repeated_password":"",
       "first_name":"",
       "last_name":"",
       "phone":"",
       }

       create new user and login him
       :return: success or error
       """

    user_login = request.json.get('login')
    password = request.json.get('password')
    repeated_password = request.json.get('repeated_password')

    if not (password and repeated_password and user_login):
        abort(400, 'missing required fields')

    if password != repeated_password:
        abort(400, 'passwords does not match')

    cs = ClientService()
    client = cs.register_new_user(user_login, password)
    login_user(client)
    return jsonify(success=True)


@app.route('/api/bikes')
def get_cars():
    """
    :return JSON: {
        'data': [
         {
            "brakes": "Shimano Ultegra DM",
            "chain": "FSA TH-CN1102",
            "firm": "BH",
            "frame": "Global Concept G7 Pro Carbon Monocoque",
            "id": 1,
            "image": "",
            "model": "G7 Pro",
            "seat": "Prologo Kappa RS",
            "type": "шосейний"
        }
        ]
    }
    """
    bs = BikeService()
    return {
        'data': [bike.to_dict() for bike in bs.get_bikes()]
    }


@app.route('/api/bikes/filter/firm')
def get_firm_filter_values():
    """
    :return: JSON: {
    'values':[
        {
            "id":1,
            "name":""
        }
    ]
    }
    """
    bs = BikeService()
    return {
        'values': [item.to_dict() for item in bs.get_firm_filter()]
    }


@app.route('/api/bikes/filter/type')
def get_type_filter_values():
    """
    :return: JSON: {
    'values':[
        {
            "id":1,
            "name":""
        }
    ]
    }
    """
    bs = BikeService()
    return {
        'values': [item.to_dict() for item in bs.get_type_filter()]
    }


@app.route('/api/test-drive/create', methods=["POST"])
@login_required
def create_test_drive():
    """
    takes json: {
    "bike_id": <int: bike`s id to test drive>,
    "date": <int: test drive date in format od unix time (seconds)>,
    "dealer_center_id": <int: id of dealer center>
    }
    :return: 200 or 40X error
    """
    bike_id = request.json.get('bike_id')
    date = request.json.get('date')
    dealer_center = request.json.get('dealer_center_id')

    if not (bike_id and date and dealer_center):
        abort(400, 'Not correct value')

    tds = TestDriveService()
    try:
        tds.create_test_drive(bike_id, date, current_user.id, dealer_center)
    except error.BookTestDriveIsImpossible as e:
        abort(400, e.description)

    return jsonify(success=True)


@app.route('/api/test-drive/history')
@login_required
def get_test_drives():
    """
    :return: JSON: {
    "history: [
        {
        "car": "2020 Toyota Tundra TRD Pro",
        "date": 1655413200,
        "dealer_center": "Toyota Center, м.Харків, вул.Сумська, 90",
        "id": 1,
        "status": 0
        }
    ]
    }
    """

    tds = TestDriveService()
    return {
        "history": [item.to_dict() for item in tds.get_test_drives_by_client(current_user.id)]
    }


@app.route('/api/test-drive/dealer-centers')
@login_required
def get_dealer_centers():
    """
    :return: JSON: {
    "data":[
        {
            "address": "м.Київ, вул.Хрещатик, 17",
            "id": 2,
            "name": "Elite cars showroom"
        }
    ]
    }
    """
    ds = DealerService()
    return {
        'data': [item.to_dict() for item in ds.get_dealer_centers()]
    }


@app.route('/api/bikes/test-drive/<int:test_drive_id>')
@login_required
def get_car_by_test_drive(test_drive_id: int):
    """
    ::return JSON: {
             "brakes": "Shimano Ultegra DM",
            "chain": "FSA TH-CN1102",
            "firm": "BH",
            "frame": "Global Concept G7 Pro Carbon Monocoque",
            "id": 1,
            "image": "",
            "model": "G7 Pro",
            "seat": "Prologo Kappa RS",
            "type": "шосейний"
        }
    """

    bs = BikeService()
    return bs.get_bike_by_test_drive(test_drive_id).to_dict()


@app.route('/api/test-drives/complete/<int:id>', methods=['POST'])
@login_required
def complete_test_drive(id: int):
    """
    :return: 200
    """

    if id <= 0:
        abort(400, 'Invalid id')

    tds = TestDriveService()
    tds.complete(id)
    return jsonify(success=True)


@app.route('/api/bikes/dealer-center/<int:bike_id>')
@login_required
def get_dealer_center_by_car(bike_id: int):
    """
    :return: dealer centers where car is persist
    JSON: {
    "data":[
        {
            "address": "м.Київ, вул.Хрещатик, 17",
            "id": 2,
            "name": "Elite cars showroom"
        }
    ]
    }
    """
    ds = DealerService()
    return {
        'data': [item.to_dict() for item in ds.get_dealer_center_by_bike(bike_id)]
    }


@app.route('/api/bikes/dealer-center/booked')
@login_required
def get_booked_bikes_for_center():
    """
    takes car_id and dealer_center_id as query params
    Example: /api/bikes/dealer-center/booked?bike_id=1&dealer_center_id=1
    :return: {
    "data": [<list of time in unix timestamp (in seconds) truncated to day where car is booked for test drive>]
    }
    """

    bike_id = int(request.args.get('bike_id'))
    dealer_center_id = int(request.args.get('dealer_center_id'))

    if not (bike_id and dealer_center_id):
        abort(400, "Id is required")

    ds = DealerService()
    return {
        'data': ds.get_booked_dates(bike_id, dealer_center_id)
    }


app.run()
