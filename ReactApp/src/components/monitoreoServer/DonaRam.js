import React, { useEffect, useState } from 'react';
import axios from 'axios'
import CanvasJSReact from '../../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function DonaRam() {
    let [data2, setData] = useState([]);
    let [options, setOptions] = useState({
        animationEnabled: true,
        title: {
            text: "RAM"
        },
        subtitles: [{
            text: "li",
            verticalAlign: "center",
            fontSize: 24,
            dockInsidePlotArea: true
        }],
        data: [{
            type: "doughnut",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'%'",
        }]
    });

    const getData = async () => {
        try {
            //const { data } = await axios.get('http://localhost:5000/RamUtilizada');
            const { data } = await axios.get('http://34.72.201.120:4000/RamUtilizada');

            if (data && data.length) {
                if (typeof data != 'undefined') {
                    let d = data.replace("\n", "");
                    d = d.replace("Grupo: g5SO: Fedora Workstation\n", "");
                    d = d.replaceAll("\n", "");
                    d = d.replaceAll("	", "");
                    d = d.replaceAll("		", "");
                    d = d.replaceAll(" ", "");
                    d = d.replaceAll("MemoriaTotal", "T");
                    d = d.replaceAll("MemoriaDisponible", "D");
                    d = d.replaceAll(":", "");
                    d = d.replaceAll("KB", "");


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
                    options.data[0].dataPoints = [{ name: "Libre", y: porcentajeLibre }, { name: "Usado", y: porcentajeUsado }];
                    options.subtitles[0].text = options.data[0].dataPoints[0].y + "% Libre";
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
            <CanvasJSChart options={options}
            />
        </div>
    );
}