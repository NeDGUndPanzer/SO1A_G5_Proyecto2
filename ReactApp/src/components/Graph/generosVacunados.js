import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import {
    createMuiTheme,
    MuiThemeProvider
} from "@material-ui/core/styles";
import Alertas from '../Alertas/Alertas';
import CanvasJSReact from '../../canvasjs.react';
let CanvasJS = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart;
const theme = createMuiTheme({
    typography: {
        fontSize: 20
    },
});

const useStyles = makeStyles({
    container: {
        WebkitBorderRadius: '30px',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        borderTop: '1px solid #6E6E6E',
        borderBottom: '1px solid #6E6E6E',
        borderLeft: '1px solid #6E6E6E',
        borderRight: '1px solid #6E6E6E',
    },
    bloque: {
        textAlign: 'right',
        display: 'block',
    },
    alinearAlerta: {
        display: 'inline-block',
        width: '50%'
    },
    bloqueCentrado: {
        textAlign: 'center',
        display: 'block',

    },
    alinearBloque: {
        display: 'inline-block',
        width: '50%'
    },
    grafica: {
        padding: '4px',
        background: '#fff',
        borderRadius: '20px',
    },
    contGrafica: {
        height: '420px',
        width: '370',
        border: '1px solid #ddd',
        background: '#f1f1f1',
        overflowx: 'scroll',
        overflowy: 'scroll',
        borderRadius: '20px',
    },
    ancho: {
        width: 'auto',
        height: 'auto',
        borderRadius: '20px',
    },
});

export default function GenerosVacunadosPorPais() {
    let [data2, setData] = useState([]);

    let [graficarPuntos, setGraficarPuntos] = useState([]);

    let [errorData, setErrorData] = useState(false);
    let [errorServidor, setErrorServidor] = useState(false);
    const getData = async () => {
        try {
            const { data } = await axios.get('http://35.188.10.198:4000/Generos_VacunadosPorPais');
            // const { data } = await axios.get('http://34.72.201.120:4000/mensajes');
            //   setGraficarPuntos([])
            if (data && data.length) {
                setErrorServidor(false);
                let j = 1;
                let p = 0;

                for (let i = 0; i < data.length; i++) {
                    if (typeof data[i] != 'undefined') {
                        data2[p] = { key: j++, pais: data[i].pais, femenino: data[i].femenino, masculino: data[i].masculino };
                        graficarPuntos[p] =
                        {
                            exportEnabled: true,
                            theme: "dark2",
                            animationEnabled: true,
                            title: {
                                text: "Géneros"
                            },
                            data: [{
                                type: "pie",
                                startAngle: 75,
                                toolTipContent: "<b>{label}</b>: {y}%",
                                showInLegend: "true",
                                legendText: "{label}",
                                indexLabelFontSize: 16,
                                indexLabel: "{label} - {y}%",
                                dataPoints: [{ label: 'Femenino', y: data[i].femenino }, { label: 'Masculino', y: data[i].masculino }]
                            }]
                        }

                        p++;
                    }

                }
            } else {
                setErrorData(true);
            }
        }
        catch (err) {
            setErrorServidor(true);
            setErrorData(false);
            setData([]);
        }
    };

    useEffect(() => {
        const timeOut = setInterval(() => {
            getData();
            setData([...data2]);
            setGraficarPuntos([...graficarPuntos])
        }, 3000)
        getData();
        return () => clearInterval(timeOut);

    }, [])

    const classes = useStyles();

    return (
        <div className={classes.bloqueCentrado}>
            <div className={classes.alinearBloque}>
                <div className={classes.bloque}>
                    <div className={classes.alinearAlerta}>
                        <Alertas bandera={errorData} tipo='error' mensaje='No se recuperó la información' />
                        <Alertas bandera={errorServidor} tipo='error' mensaje='Servidor desconectado' />
                    </div>
                </div>
                {data2.map((Element, index1) => (
                    <div id={`tabla-${index1}`} key={`${index1}`}>
                        <label style={{ fontSize: 20, fontWeight: 'bold' }} > {Element.key} . &nbsp; {Element.pais}</label>
                        <br></br>
                        <div className={classes.contGrafica}>
                            <div className={classes.ancho}>
                                <div className={classes.grafica}>
                                    <CanvasJSChart options={graficarPuntos[index1]} />
                                </div>
                            </div>
                        </div>
                        <br></br>
                    </div>
                ))}
            </div>
        </div>
    );
}
