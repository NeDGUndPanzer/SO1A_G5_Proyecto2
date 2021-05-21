import React, { useEffect, useState } from 'react';
import axios from 'axios'
import CanvasJSReact from '../../canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function InfectadosPorEstado(){
    let [data2, setData] = useState([]);
    let [options, setOptions] = useState({
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Estados"
        },
        data: [{
            type: "pie",
            startAngle: 75,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: []
        }]
    });
   
    const getData = async () => {
        try {
            //const { data } = await axios.get('http://localhost:5000/InfectadosPorEstado');
            const { data } = await axios.get('http://34.72.201.120:4000/InfectadosPorEstado');
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (typeof data[i] != 'undefined') {
                    options.data[0].dataPoints = data.map(Item => ({ label: Item._id, y: Item.porcentaje.replace("%","") }))
                    
                    setOptions({...options});
                    }
                }
            }else {
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
            <CanvasJSChart options = {options}/>
        </div>
    );
}