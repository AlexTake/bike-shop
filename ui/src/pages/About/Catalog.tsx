import React, {useEffect, useState} from 'react';
import {
    Box, Card, CardActions, CardContent, CardHeader, CardMedia,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Slider, Tooltip,
    Typography
} from "@mui/material";
import {Api, GetCars} from "../../api/Api";
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import InfoIcon from '@mui/icons-material/Info';
import cl from './Catalog.module.css';
import ModalCar from "./components/ModalCar";
import ModalTestDrive from "./components/ModalTestDrive";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import PedalBikeIcon from '@mui/icons-material/PedalBike';

const Catalog = () => {

    const [loading, setLoading] = useState(false)
    const [cars, setCars] = useState<GetCars[]>([]);

    const [frames, setFrames] = useState([]);
    const [frame, setFrame] = useState("Оберіть раму");
    const [seats, setSeats] = useState([]);
    const [seat, setSeat] = useState("Оберіть сідло");
    const [types, setTypes] = useState([]);
    const [type, setType] = useState("Оберіть тип");
    const [chains, setChains] = useState([]);
    const [chain, setChain] = useState("Оберіть ціпь");
    const [brakeses, setBrakeses] = useState([]);
    const [brakes, setBreakes] = useState("Оберіть гальма");
    const [firm, setFirm] = useState("Оберіть виробника");
    const [firms, setFirms] = useState([]);
    const [model, setModel] = useState("Оберіть модель");

    const [sidebar, setSidebar] = useState(false);

    const [modal, setModal] = useState(false);
    const [modalTest, setModalTest] = useState(false);
    const [currentCar, setCurrentCar] = useState(-1);

    useEffect(() => {
        const api = new Api();
        try {
            setLoading(true);
            const promises = [];

            const promise1 = new Promise((resolve, reject) => {
                api.getCars().then(res => {
                    const data = res.data.data;

                    const firms = new Array(...new Set(data.map(r => r.firm)));
                    const frames = new Array(...new Set(data.map(r => r.frame)));
                    const seats = new Array(...new Set(data.map(r => r.seat)));
                    const types = new Array(...new Set(data.map(r => r.type)));
                    const chains = new Array(...new Set(data.map(r => r.chain)));
                    const brakes = new Array(...new Set(data.map(r => r.brakes)));

                    setFirms(["Оберіть виробника", ...firms]);
                    setFrames(["Оберіть раму", ...frames]);
                    setSeats(["Оберіть сідло", ...seats]);
                    setTypes(["Оберіть тип", ...types]);
                    setChains(["Оберіть ціпь", ...chains]);
                    setBrakeses(["Оберіть гальма", ...brakes]);

                    setCars([...data]);
                    resolve(true);
                }).catch(err => {
                    reject(err);
                });
            })

            promises.push(promise1);

            Promise.all(promises).then(e => setLoading(false)).catch(e => setLoading(false));

        } catch (e) {
            console.log(e)
        }
    }, [])

    const handleChangeFirm = (e) => {
        const value = e.target.value;

        setModel("Оберіть модель");
        setFirm(value);
    }

    const handleChangeSelectedCar = (e, id) => {
        setCurrentCar(id);
        setModal(true);
    }

    const handleChangeSelectedTestdrive = (e, id) => {
        setCurrentCar(id);
        setModalTest(true);
    }

    const filterCars = () => {
        let carsTemp = cars;

        if (firm !== "Оберіть виробника")
            carsTemp = carsTemp.filter(x => x.firm === firm);
        if (model !== "Оберіть модель")
            carsTemp = carsTemp.filter(x => x.model === model);
        if (seat !== "Оберіть сідло")
            carsTemp = carsTemp.filter(x => x.seat === seat);
        if (brakes !== "Оберіть гальма")
            carsTemp = carsTemp.filter(x => x.brakes === brakes);
        if (frame !== "Оберіть раму")
            carsTemp = carsTemp.filter(x => x.frame === frame);
        if (type !== "Оберіть тип")
            carsTemp = carsTemp.filter(x => x.type === type);
        if (chain !== "Оберіть ціпь")
            carsTemp = carsTemp.filter(x => x.chain === chain);
        if (type !== "Оберіть тип")
            carsTemp = carsTemp.filter(x => x.type === type);

        return carsTemp;
    }

    return (
        <Box>
            {loading ? <CircularProgress/> :
                <Box display={"flex"} marginTop={"10px"} justifyContent={"space-between"}>
                    {currentCar !== -1 && <ModalCar car={cars.filter(x => x.id === currentCar)[0]} open={modal}
                                                    setModal={setModal}></ModalCar>}
                    {currentCar !== -1 &&
                        <ModalTestDrive carId={cars.filter(x => x.id === currentCar)[0].id} open={modalTest}
                                        setModal={setModalTest}></ModalTestDrive>}
                    <Box display={""} width={sidebar ? "70%" : "95%"}>
                        <Box display={"flex"} flexWrap={"wrap"}>
                            {filterCars().length > 0 ? filterCars().map(c => (
                                    <Box id={c.id.toString()} className={cl.car__card}>
                                        <Box className={cl.content}>
                                            <img width={"50%"}
                                                 src={c.image}/>
                                            <Typography className={cl.car__firm}>{c.firm}</Typography>
                                            <Typography className={cl.car__model}>{c.model}</Typography>
                                            <Tooltip title={"Детальніше"}>
                                                <IconButton onClick={e => handleChangeSelectedCar(e, c.id)}
                                                            color={"primary"} className={cl.desc}>
                                                    <InfoIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={"Замовити"}>
                                                <IconButton onClick={e => handleChangeSelectedTestdrive(e, c.id)}
                                                            color={"primary"} className={cl.testdrive}>
                                                    <PedalBikeIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                            )) : <Typography fontSize={"32px"} width={"100%"} align={"center"}>Нічого не
                                знайдено!</Typography>}
                        </Box>
                    </Box>
                    <IconButton sx={{display: sidebar ? "none" : "block"}} onClick={e=>setSidebar(true)}>
                        <ArrowCircleLeftIcon/>
                    </IconButton>
                    <Box display={sidebar ? "block" : "none"} sx={{background: "rgba(238,238,238,0.46)", padding: "2%", transition: "width 2s", width: sidebar ? "25%" : "0%"}}>
                        <IconButton onClick={e=>setSidebar(false)}>
                            <ArrowCircleRightIcon/>
                        </IconButton>
                        <Typography fontSize={"20px"} sx={{marginBottom: "20px"}}>
                            Сортувати за фільтрами
                        </Typography>
                        <FormControl fullWidth sx={{marginBottom: "40px"}}>
                            <InputLabel id="demo-simple-select-label">Виробник</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={firm}
                                label="Виробник"
                                onChange={handleChangeFirm}
                            >
                                {firms.map((f, i) => (
                                    <MenuItem key={i} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{
                            display: firm !== "Оберіть виробника" ? "inline-flex" : "none",
                            marginBottom: "40px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Модель</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={model}
                                label="Модель"
                                onChange={e => setModel(e.target.value)}
                            >
                                {["Оберіть модель",...new Array(...new Set(cars.filter(f => f.firm === firm).map(d=>d.model)))]?.map((f, i) => (
                                    <MenuItem key={i} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{
                            marginBottom: "40px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Тип</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                label="Тип"
                                onChange={e => setType(e.target.value)}
                            >
                                {types.map((f, i) => (
                                    <MenuItem key={i} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{
                            marginBottom: "40px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Гальма</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={brakes}
                                label="Гальма"
                                onChange={e => setBreakes(e.target.value)}
                            >
                                {brakeses.map((f, i) => (
                                    <MenuItem key={i} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{
                            marginBottom: "40px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Ціпь</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={chain}
                                label="Ціпь"
                                onChange={e => setChain(e.target.value)}
                            >
                                {chains.map((f, i) => (
                                    <MenuItem key={i} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{
                            marginBottom: "40px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Рама</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={frame}
                                label="Рама"
                                onChange={e => setFrame(e.target.value)}
                            >
                                {frames.map((f, i) => (
                                    <MenuItem key={i} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{
                            marginBottom: "40px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Сідло</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={seat}
                                label="Сідло"
                                onChange={e => setSeat(e.target.value)}
                            >
                                {seats.map((f, i) => (
                                    <MenuItem key={i} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            }
        </Box>
    );
};

export default Catalog;