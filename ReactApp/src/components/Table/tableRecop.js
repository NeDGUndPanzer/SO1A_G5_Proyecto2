import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
const useStyles = makeStyles({
    table: {
        minWidth: 150,
    },
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function DenseTable() {

    let [data2, setData] = useState([]);

    const getData = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/mensajes');
            if (data && data.length) {
                let i = 0;
                data2 = data.map(Item => ({ key: i++, name: Item.name, location: Item.location, age: Item.age, typeInf: Item.infectedtype, state: Item.state, way: Item.way }))
            } else {
                console.error('data: ', data);
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const timeOut = setInterval(() => {
            getData();
            setData([...data2]);
        }, 3000)
        getData();
        return () => clearInterval(timeOut);

    }, [])
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>

                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">No</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Location</TableCell>
                                <TableCell align="right">Age</TableCell>
                                <TableCell align="right">InfectedType</TableCell>
                                <TableCell align="right">State</TableCell>
                                <TableCell align="right">Wayssss</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data2.map((row) => (
                                <TableRow key={row.key} >
                                    <TableCell component="th" scope="row">
                                        {row.key}
                                    </TableCell>
                                    <TableCell align="right">{row.name}</TableCell>
                                    <TableCell align="right">{row.location}</TableCell>
                                    <TableCell align="right">{row.age}</TableCell>
                                    <TableCell align="right">{row.typeInf}</TableCell>
                                    <TableCell align="right">{row.state}</TableCell>
                                    <TableCell align="right">{row.way}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}