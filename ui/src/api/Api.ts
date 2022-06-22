import axios, {AxiosResponse} from "axios";

const baseURL = "http://localhost:5000/api/";

const instance = axios.create({
    withCredentials: true,
    headers: {'Content-Type': 'application/json'}
})

instance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export type Response = {
    data: any,
    message?: string
}

export type GetCars = {
    brakes: string,
    id: number,
    chain: string,
    frame: string,
    seat: string,
    firm: string,
    model: string,
    type: string,
    image: string
}

export type GetOrder = {
    created_time: number,
    id: number,
    is_delivered: boolean,
    place: string,
    sum: number
}


export type PostTestDrive = {
    bike_id: number,
    date: number,
    dealer_center_id: number
}

export type PostLogin = {
    login: string,
    password: string
}

export type Register = {
    login: string | null,
    password: string
    repeated_password: string,
}
export type GetHistory = {
    car: string,
    date: number,
    dealer_center: string,
    id: number,
    status: number
}

const cars = "bikes";
const menu = "order/menu/";
const login = "login";
const register = "sing-up";
const logout = "logout";
const history = "test-drive/history";
const createTestDrive = "test-drive/create";
const compliteOrder = "test-drives/complete/"
const dealerCenter = "bikes/dealer-center/"

instance.defaults.baseURL = baseURL;

export class Api {
    login = async (acc: PostLogin): Promise<Response> => {
        try {
            const result: AxiosResponse = await instance.post(login, acc);
            return {data: result};
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    register = async (acc: Register): Promise<Response> => {
        try {
            return await instance.post(register, acc).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    logout = async (): Promise<Response> => {
        try {
            const result: AxiosResponse = await instance.get(logout);
            return {data: result};
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getCars = async (): Promise<Response> => {
        try {
            return await instance.get(cars).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getDealersCenter = async (id: number): Promise<Response> => {
        try {
            return await instance.get(dealerCenter + id).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getItems = async (id:number): Promise<Response> => {
        try {
            return await instance.get(menu+id).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getHistory = async (): Promise<Response> => {
        try {
            return await instance.get(history).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    createTestDrive = async (order: PostTestDrive): Promise<Response> => {
        try {
            return await instance.post(createTestDrive, order).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    compliteOrder = async (id: number): Promise<Response> => {
        try {
            return await instance.post(compliteOrder + id).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getDescOrder = async (id: number): Promise<Response> => {
        try {
            return await instance.get(history + "/" + id).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
}