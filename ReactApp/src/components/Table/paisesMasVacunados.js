import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Alertas from '../Alertas/Alertas';

const columns = [
  { id: 'key', label: 'Key', minWidth: 30 },
  { id: 'pais', label: 'País', minWidth: 70 },
  {
    id: 'cantidad',
    label: 'Cantidad Vacunados',
    minWidth: 60,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  }
];


const useStyles = makeStyles({
  root2: {
    backgroundColor: "#C8C8C8",
  },
  container: {
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

export default function PaisesMasVacunados() {
  let [data2, setData] = useState([]);
  let [errorData, setErrorData] = useState(false);
  let [errorServidor, setErrorServidor] = useState(false);
  const getData = async () => {
    // const { data } = await axios.get('https://us-central1-nifty-inkwell-308322.cloudfunctions.net/paisesMasVacunados');
    // console.log(data)
    try {
      const { data } = await axios.get('https://us-central1-nifty-inkwell-308322.cloudfunctions.net/paisesMasVacunados');
      // const { data } = await axios.get('http://localhost:5000/paisesMasVacunados');
      // const { data } = await axios.get('http://34.72.201.120:4000/mensajes');
      if (data && data.length) {
        setErrorServidor(false);
        let j = 1;
        let p = 0;
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] != 'undefined') {
            data2[p] = { key: j++, pais: data[i].pais, cantidad: data[i].cantidadVacunados};
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
      <div className={classes.bloqueCentrado}>
          <div className={classes.alinearBloque}>
      <div className={classes.bloque}>
        <div className={classes.alinearAlerta}>
          <Alertas bandera={errorData} tipo='error' mensaje='No se recuperó la información' />
          <Alertas bandera={errorServidor} tipo='error' mensaje='Servidor desconectado' />
        </div>
      </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead >
            <TableRow >
              {columns.map((column, index) => (
                <TableCell className={classes.root2}
                  // key={column.id}
                  key={`${index}`}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontFamily: 'Arial', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ backgroundColor: '#FFF', }}>
            {/* {data2.filter(f=>(opciones!=""&&opciones!=null?f.way===opciones:true)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => { */}
            {data2.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={`${index}`}>
                  {columns.map((column, index) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={`${index}`} align={column.align} style={{ fontSize: 18, textAlign: 'center' }} >
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={data2.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        style={{
          backgroundColor: '#C8C8C8',
          borderBottomRightRadius: '30px',
          borderBottomLeftRadius: '30px',
          borderTop: '1px solid #6E6E6E',
          borderBottom: '1px solid #6E6E6E',
          borderLeft: '1px solid #6E6E6E',
          borderRight: '1px solid #6E6E6E',
        }}
      />
    </div>
      </div>
  );
}
