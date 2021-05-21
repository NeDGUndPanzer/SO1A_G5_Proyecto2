import React, { useEffect, useState } from 'react';
import axios from 'axios'
import CanvasJSReact from '../../canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function DeptMasInfec() {
    let [options, setOptions] = useState({
        animationEnabled: true,
        title: {
            text: "Departamentos"
        },
        data: [{
            type: "funnel",
            toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
            indexLabelPlacement: "inside",
            indexLabel: "{label} ({percentage}%)",

            dataPoints: []
        }]
    });
    var dataPoint;
    var total;
    let [data2, setData] = useState([]);


    const getData = async () => {
        try {
            //const { data } = await axios.get('http://localhost:5000/deptMasInfec');
            const { data } = await axios.get('http://34.72.201.120:4000/deptMasInfec');
            if (data && data.length) {
                options.data[0].dataPoints = data.map(Item => ({ label: Item._id, y: Item.contador }))
                dataPoint = options.data[0].dataPoints;
                if (dataPoint && dataPoint[0]) {
                    total = dataPoint[0].y;

                    for (var i = 0; i < dataPoint.length; i++) {
                        if (typeof data[i] != 'undefined') {
                            if (i == 0) {
                                options.data[0].dataPoints[i].percentage = 100;
                            } else {
                                options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
                            }
                        }
                    }
                }
                setOptions({ ...options });

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
    //calculate percentage

    return (
        <div>
            <CanvasJSChart options={options}/>
        </div>
    );
}