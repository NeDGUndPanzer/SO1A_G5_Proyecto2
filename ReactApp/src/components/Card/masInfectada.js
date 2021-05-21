import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Box from '@material-ui/core/Box';

export default function CardMasInfectada() {
  let [data2, setData] = useState([]);

  const getData = async () => {
    try {

      const temp = await axios.get('http://34.72.201.120:4000/masInfectada');
      const data  = [];
      data.push(temp.data);
      if (typeof data[0] != 'undefined') {
        data2 = [{ name: data[0].region, contador: data[0].contador }]
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
    <div style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF " } }>
      
      <Box border="15px solid #FFFFFF" display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
        <Box p={1} bgcolor="#496300 ">
        <h3 style={{ textAlign: "center", font:"Verdana" , color: "#496300" }}>SAS</h3>
        </Box>
        <Box p={1} bgcolor="grey.300">
          {data2.map((row,index) => (
            <h3 style={{ textAlign: "center", font:"Verdana" , color: "#000000" }} key={`${index}`}>{row.name} : {row.contador} infectados</h3>
          ))}

        </Box>
        <Box p={1} bgcolor="#496300 ">
        <h3 style={{ textAlign: "center", font:"Verdana" , color: "#496300" }}>SAS</h3>
        </Box>
      </Box>
      <div align="center">
        <img src="/regiones.jpeg" width="400" height="400"/>
      </div>
      
    </div>
  );
}
