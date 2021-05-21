import React, { useEffect, useState } from 'react';
import axios from 'axios'
import CanvasJSReact from '../../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function RangoEdadesInfectados() {
    let [data2, setData] = useState([]);
    let [options, setOptions] = useState({
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Edades"
        },
        axisX: {
            title: "Rango de edades",
            reversed: true,
        },
        axisY: {
            title: "Total infectados",
            includeZero: true
        },
        data: [{
            type: "column",
            dataPoints: []
        }]
    });

    const getData = async () => {
        try {
            //const { data } = await axios.get('http://localhost:5000/edadesInfectados');
            const { data } = await axios.get('http://34.72.201.120:4000/edadesInfectados');
            let p = 0;
            
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (typeof data[i] != 'undefined') {
                        options.data[0].dataPoints = data.map(Item => ({ label: Item.rango, y: Item.contador }))
                        setOptions({ ...options });
                    }
                }
            // for (var i = data.length; i >= 0; i--) {
            //     if (typeof data[i] != 'undefined') {
            //                     options.data[0].dataPoints = data.map(Item => ({ label: Item.rango, y: Item.contador }))
            //                 setOptions({ ...options });
            //     }
            //     else {
            //         console.error('data: ', data);
            //     }
            //     }
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
            <CanvasJSChart options={options} />
        </div>
    );
}