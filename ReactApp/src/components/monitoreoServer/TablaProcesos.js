import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const columns = [

  {
    id: 'pid',
    label: 'PID',
    minWidth: 40,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'name',
    label: 'Name',
    minWidth: 140,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'fatherPid',
    label: 'Father PID',
    minWidth: 140,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 60,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  root2: {
    backgroundColor: "#FCF9B4",
  },
  container: {
    maxHeight: 440,
  },
});

export default function TablaProcesos() {
  let [data2, setData] = useState([]);

  const getData = async () => {
    try {
      const { data }  = await axios.get('http://34.72.201.120:4000/ListaProcesos');
      if (data && data.length) {
        let arreglo = data.substring(6,data.length-8).split("\n")
        let resultados = arreglo.map(a => {
          let informacion = a.split(";")
          return {pid: informacion[0], name: informacion[1], fatherPid: informacion[2], status: informacion[3]}
        });
        data2 = resultados;
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

    <Card className={classes.root}>
      <CardContent>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table" >
              <TableHead>
                <TableRow >
                  {columns.map((column, index) => (
                    <TableCell className={classes.root2}
                      // key={column.id}
                      key={`${index}`}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}

                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>

                {data2.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  return (

                    <TableRow hover role="checkbox" tabIndex={-1} key={`${index}`}>

                      {columns.map((column, index) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={`${index}`} align={column.align} >
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
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data2.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}
