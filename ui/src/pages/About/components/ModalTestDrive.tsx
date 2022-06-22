import React, {useEffect, useState} from 'react';
import {Api, GetCars, PostTestDrive} from "../../../api/Api";
import {
    Alert, AlertProps,
    Box,
    Button, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem,
    Modal,
    Paper, Select, Step, StepButton, Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, TextField,
    Typography
} from "@mui/material";
import moment from "moment";
import {LocalizationProvider, MobileDatePicker} from '@mui/x-date-pickers';
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import CloseIcon from "@mui/icons-material/Close";

const FirstStep = ({date, setDate}) => {
    return (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
                    showToolbar={false}
                    closeOnSelect={true}
                    inputFormat="DD/MM/yyyy"
                    minDate={moment()}
                    value={date}
                    onChange={e => setDate(e)}
                    renderInput={(params) => <TextField sx={{margin:"50px 0px"}} id={"inputDate"} {...params}
                                                        placeholder={"Оберіть дату"}
                                                        fullWidth={true}
                                                        variant={"standard"}/>}
                />
            </LocalizationProvider>
        </Box>
    )
}

const SecondStep = ({carId, filial, setFilial}) => {

    const [loading, setLoading] = useState(false);
    const [filials, setFilials] = useState([]);

    useEffect(()=>{
        setLoading(true)
        const api = new Api();
        api.getDealersCenter(carId).then(res => {
            setFilials(new Array(...new Set(res.data.data)));
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });
    }, [carId])

    return (
        <Box>
            <CircularProgress sx={{display: !loading && "none"}}/>
            <FormControl sx={{display: loading && "none", margin:"40px 0px"}} fullWidth>
                <InputLabel id="demo-simple-select-label">Філіал</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filial}
                    label="Філіал"
                    onChange={e=>setFilial(e.target.value)}
                >
                    {filials.map((f, i) => (
                        <MenuItem key={f.id} value={f.id}>{f.name} ({f.address})</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

const ModalTestDrive = ({carId, open, setModal}) => {
    const steps = ['Оберіть дату', 'Оберіть філіал'];
    const [messageHandler, setMessageHandler] = useState({type: "" as AlertProps["severity"], message: ""});
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const [allComplited, setAllComplited] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedFilial, setSelectedFilial] = useState(-1);

    useEffect(()=>{
        setActiveStep(0);
        setSelectedDate(null);
        setMessageHandler({...messageHandler, message: ""});
        setCompleted({});
        setAllComplited(false);
    }, [carId])

    const totalSteps = () => {
        return steps.length;
    };

    const handleNext = () => {
        const newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
        borderRadius: "10px"
    };

    const [loading, setLoading] = useState(false);

    const createTestDrive = () => {
        setLoading(true);
        const api = new Api();
        const data = {bike_id: carId, date: moment(selectedDate).unix(), dealer_center_id: selectedFilial} as PostTestDrive;
        api.createTestDrive(data).then(res => {
            setMessageHandler({type:"success", message: "Заявку створено!"});
            setLoading(false);
            setAllComplited(true);
            setCompleted({[0]:true, [1]:true});
            setTimeout(()=>{
                setModal(false);
            }, 1000);
        }).catch(err => {
            console.log(err)
            setLoading(false)
        });
    }

    console.log(activeStep, totalSteps() - 1, !selectedFilial, loading, allComplited)

    return (
        <Modal
            open={open}
            onClose={e => setModal(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{
                ...style,
                minHeight: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 800
            }}>
                <Grid sx={{marginBottom: "30px"}} item xs={12}>
                    {messageHandler.message.length > 0 && <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setMessageHandler({...messageHandler, message: ""})
                                }}
                            >
                                <CloseIcon fontSize="inherit"/>
                            </IconButton>
                        }
                        severity={messageHandler.type}>{messageHandler.message}
                    </Alert>}
                </Grid>
                <h2 id="parent-modal-title">Замовлення на тестдрайв авто #{carId}</h2>
                <Box sx={{width: '100%', height:"100%"}}>
                    <Stepper nonLinear activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                                <StepButton color="inherit" onClick={handleStep(index)}>
                                    {steps[index]}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    <div>
                        <React.Fragment>
                            {activeStep === 0 ? <FirstStep date={selectedDate} setDate={setSelectedDate}/> : <SecondStep carId={carId} filial={selectedFilial} setFilial={setSelectedFilial}/>}
                            <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                <Button
                                    color="inherit"
                                    variant={"contained"}
                                    disabled={activeStep === 0 || loading || allComplited}
                                    onClick={handleBack}
                                    sx={{mr: 1}}
                                >
                                    Назад
                                </Button>
                                <Box sx={{flex: '1 1 auto'}}/>
                                <Button variant={"contained"}
                                        disabled={activeStep === totalSteps() - 1 || !selectedDate || loading || allComplited} onClick={handleNext}
                                        sx={{mr: 1}}>
                                    Далі
                                </Button>
                                <Button variant={"contained"} disabled={activeStep !== totalSteps() - 1 || selectedFilial === -1 || loading || allComplited}
                                        onClick={createTestDrive}>
                                    {loading && <CircularProgress style={{height:"30px", width:"30px", marginRight:"10px"}}/>}
                                    Замовити
                                </Button>
                            </Box>
                        </React.Fragment>
                    </div>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalTestDrive;