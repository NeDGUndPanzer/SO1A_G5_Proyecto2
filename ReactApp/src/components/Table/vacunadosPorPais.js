import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import {
    createMuiTheme,
    MuiThemeProvider
  } from "@material-ui/core/styles";
import Alertas from '../Alertas/Alertas';
import { DataGrid } from '@material-ui/data-grid';

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
  }
});

export default function VacunadosPorPais() {
  let [data2, setData] = useState([]);
  let [errorData, setErrorData] = useState(false);
  let [errorServidor, setErrorServidor] = useState(false);
  const getData = async () => {
    try {
      const { data } = await axios.get('https://us-central1-nifty-inkwell-308322.cloudfunctions.net/vacunadosPorPais');
      // const { data } = await axios.get('http://34.72.201.120:4000/mensajes');

      if (data && data.length) {
        setErrorServidor(false);
        let j = 1;
        let p = 0;
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] != 'undefined') {
            let arr=[];
            let t=1;
            data[i].vacunados.map(a=>(
                arr.push({id: t++, nombre: a.name})
            ))
            data2[p] = { key: j++, pais: data[i].pais, vacunados: arr};
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
    }, 3000)
    getData();
    return () => clearInterval(timeOut);

  }, [])

  const classes = useStyles();

  const columns2 = [
    { field: 'id2', headerName: ' ', width: 155, align: 'center' },
    { field: 'id', headerName: 'No.', width: 95, align: 'center' },
    { field: 'nombre', headerName: 'Nombre', width: 350, align: 'center' },
  ];

  return (
    <div className={classes.bloqueCentrado}>
        <div className={classes.alinearBloque}>
            <div className={classes.bloque}>
                <div className={classes.alinearAlerta}>
                    <Alertas bandera={errorData} tipo='error' mensaje='No se recuperó la información' />
                    <Alertas bandera={errorServidor} tipo='error' mensaje='Servidor desconectado' />
                </div>
            </div>
            { 
                data2.map((Element, index1)=>(
                    <div id={`tabla-${index1}`} key={`${index1}`}>
                        <label style={{fontSize: 20, fontWeight: 'bold'}} > {Element.key} . &nbsp; {Element.pais} &nbsp; - &nbsp; {Element.vacunados.length}</label>
                        <br></br>
                        <div className={classes.container} style={{ height: 400, width: '100%', backgroundColor: '#FFF' }}>
                            <MuiThemeProvider theme={theme}>
                                <DataGrid rows={Element.vacunados} columns={columns2} pageSize={5} />
                            </MuiThemeProvider>
                        </div>
                        <br></br>
                    </div>
                ))
            }
        </div>
    </div>
  );
}
