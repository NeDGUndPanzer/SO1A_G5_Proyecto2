import React, { useEffect, useState } from 'react';
import axios from 'axios'
import CanvasJSReact from '../../canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function PoligRam() {
    let [data2, setData] = useState([]);
    let [options, setOptions] = useState({
        animationEnabled: true,
        title: {
            text: "RAM"
        },
        axisY: {
            title: "Porcentaje de memoria utilizada\n",
            suffix: " %"
        },
        axisX: {
            title: "Tiempo",
        },
        width: 700,
        data: [{
            type: "splineArea",
            xValueFormatString: "YYYY",
            yValueFormatString: "#,##0.## bn kW⋅h",
            dataPoints: [
            ]
        }]
    });

    const getData = async () => {
        try {
            const { data } = await axios.get('http://34.72.201.120:4000/RamUtilizada');

            if (data && data.length) {
                if (typeof data != 'undefined') {
                    let d = data.replace("\n", "")
                    .replace("Grupo: g5SO: Fedora Workstation\n", "")
                    .replaceAll("\n", "")
                    .replaceAll("	", "")
                    .replaceAll("		", "")
                    .replaceAll(" ", "")
                    .replaceAll("MemoriaTotal", "T")
                    .replaceAll("MemoriaDisponible", "D")
                    .replaceAll(":", "")
                    .replaceAll("KB", "");


                    let strTotal = "";
                    let strDispo = "";
                    let activaDispo = false;
                    let activaTotal = false;
                    for (let i = 0; i < d.length; i++) {
                        if (d[i] === 'T') {
                            activaTotal = true;
                            continue;
                        }
                        if (d[i] === 'D') {
                            activaTotal = false;
                            activaDispo = true;
                            continue;
                        }
                        if (d[i] === 'M') {
                            break;
                        }
                        if (activaTotal) {
                            strTotal += d[i];
                            continue;
                        }
                        if (activaDispo) {
                            strDispo += d[i];
                        }

                    }
                    let total, libre, porcentajeLibre, usado, porcentajeUsado;
                    total = parseInt(strTotal);
                    libre = parseInt(strDispo);
                    usado = total - libre;

                    porcentajeLibre = (100 * libre) / total;
                    porcentajeUsado = (100 * usado) / total;
                    porcentajeLibre = parseInt(porcentajeLibre * (10 ** 2))/(10 ** 2);  
                    porcentajeUsado = parseInt(porcentajeUsado * (10 ** 2))/(10 ** 2)
                    options.data[0].dataPoints.push({ label: "", y: porcentajeUsado });
                    //options.subtitles[0].text = options.data[0].dataPoints[0].y + "% Libre";
                    setOptions({ ...options });
                }

            } else {
                console.error('data: ', data);
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    // const getData = async () => {
    //     try {
    //         //const { data } = await axios.get('http://localhost:5000/UtilizacionRam');
    //         const { data } = await axios.get('http://34.72.201.120:4000/UtilizacionRam');
    //         if (data && data.length) {
    //             for (var i = 0; i < data.length; i++) {
    //                 if (typeof data[i] != 'undefined') {
    //                     options.data[0].dataPoints = data.map(Item => ({ label: Item.x, y: Item.y }))
    //                     setOptions({ ...options });
    //                 }
    //             }
    //         } else {
    //             console.error('data: ', data);
    //         }
    //     }
    //     catch (err) {
    //         console.error(err);
    //     }
    // };

    useEffect(() => {
        const timeOut = setInterval(() => {
            getData();
            setData([...data2]);
        }, 3000)
        getData();
        return () => clearInterval(timeOut);

    }, [])
    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
}