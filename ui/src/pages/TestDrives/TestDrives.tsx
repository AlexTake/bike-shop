import {Box, Button, CircularProgress, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow} from '@mui/material';
import React, {useEffect, useState} from 'react';
import moment from "moment";
import {Api, GetHistory} from "../../api/Api";

const TestDrives = () => {

    const [testDrives, setTestDrives] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true);
        const api = new Api();
        api.getHistory().then(res=>{
            setTestDrives(res.data.history);
            setLoading(false);
        }).catch(err=>{
            setLoading(false);
            console.log(err)
        })
    }, [])

    const compliteOrder = (e, id) => {
        const api = new Api();
        api.compliteOrder(id).then(res=>{
            // setMessageHandler({type: "success", message: "Замовлення №" +id+ " підтверджено!"})
            const newHistory = testDrives.map(x=>{
                if(x.id === id)
                {
                    const newValue = {
                        id: x.id,
                        car: x.car,
                        dealer_center: x.dealer_center,
                        status: x.status === 0 ? 1 : 0,
                        date: x.date
                    } as GetHistory
                    x = newValue;
                }
                return x;
            })
            setTestDrives(newHistory);
        }).catch(err=>{
            console.log(err)
            // setMessageHandler({type: "error", message: "Замовлення №" +id+ " не підтверджено!"})
        })
    }

    return (
        <Box display={"flex"} justifyContent={"center"} sx={{marginTop:"30px"}}>
            {loading ? <CircularProgress/> :
                <TableContainer sx={{width:"50%", maxHeight:"700px"}} component={Paper}>
                    <Table stickyHeader size={"medium"}>
                        <TableHead>
                            <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Вело</TableCell>
                                <TableCell>Магазин</TableCell>
                                <TableCell>Статус</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testDrives.length > 0 ? testDrives.map(h => (
                                    <TableRow key={h.id}>
                                        <TableCell>{h.id}</TableCell>
                                        <TableCell>{moment.unix(h.date).format("MM-DD-YYYY")}</TableCell>
                                        <TableCell>{h.car}</TableCell>
                                        <TableCell>{h.dealer_center}</TableCell>
                                        <TableCell>{h.status === 1 ? "Виконано" : <Button variant={"contained"} onClick={e=>compliteOrder(e, h.id)}>Підтвердити</Button>}</TableCell>
                                    </TableRow>)) :
                                <TableRow><TableCell align={"center"} colSpan={4}>Замовлень не знайдено!</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </Box>
    );
};

export default TestDrives;