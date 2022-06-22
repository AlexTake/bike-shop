import React from 'react';
import {GetCars} from "../../../api/Api";
import {Box, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";

const ModalCar = ({car, open, setModal}) => {

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
                <h2 id="parent-modal-title">Опис вело #{car.id}</h2>
                <img src={car.image} width={"50%"}/>
                <TableContainer component={Paper}>
                    <Table sx={{maxHeight:"500px", overflowY:"auto"}}>
                        <TableBody>
                            <TableRow>
                                <TableCell width={"20%"} sx={{borderRight:"1px solid"}}>Виробник</TableCell><TableCell>{car.firm}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={"20%"} sx={{borderRight:"1px solid"}}>Модель</TableCell><TableCell>{car.model}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={"20%"} sx={{borderRight:"1px solid"}}>Сідло</TableCell><TableCell>{car.seat}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={"20%"} sx={{borderRight:"1px solid"}}>Рама</TableCell><TableCell>{car.frame}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={"20%"} sx={{borderRight:"1px solid"}}>Тип</TableCell><TableCell>{car.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={"20%"} sx={{borderRight:"1px solid"}}>Ціпь</TableCell><TableCell>{car.chain}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={"20%"} sx={{borderRight:"1px solid"}}>Гальма</TableCell><TableCell>{car.brakes}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    );
};

export default ModalCar;