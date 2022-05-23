import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import {
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  TableFooter,
  TablePagination,
  Stack
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

import { Edit, Delete } from "@mui/icons-material";

import Sidebar from "../../component/Sidebar";

import "../../assets/css/System.css";
import "react-toastify/dist/ReactToastify.min.css";

const SERVICE = process.env.REACT_APP_SERVICE;

function Transform() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [transformList, setTransformList] = useState([]);
  const [transformListPerPage, setTransformListPerPage] = useState([]);

  const [schema, setSchema] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isLoad, setIsLoad] = useState(false);

  const getTableData = (transformRes) => {};

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("cookies");
        if (!token) {
          navigate("/");
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.defaults.withCredentials = true;

        const transformRes = await axios.get(`${SERVICE}/transforms/list`);
        if (transformRes.status === 200) {
          setTransformList(transformRes.data);

          const tableList = [];
          const start = page * 5;
          for (let i = start; i < start + 5; i++) {
            if (i < transformRes.data.length) {
              const res = await axios.get(
                `${SERVICE}/transforms/${transformRes.data[i].id}`
              );
              if (res.status === 200) {
                let tableData = {...res.data.Item}
                tableData.TRANSFORM_ID = transformRes.data[i].id
                tableList.push(tableData);
              }
            }
          }
          setTransformListPerPage(tableList);
        } else {
          toast.error(`Get Transform Error`);
        }

        setIsLoad(true);
      } catch (e) {
        toast.error(`Error`);
      }
    }
    fetchData();
  }, []);

  const toggleSlider = () => {
    setOpen(!open);
  };

  const sideList = () => (
    <Box component="div">
      <List>
        <ListItem button>
          <ListItemText primary="Pipeline" />
        </ListItem>
      </List>
    </Box>
  );

  const createTransform = () => {
    navigate("/create-transform", { state: { transform: null } });
  };

  const executeTransform = (item) => {
    navigate("/execute-transform", { state: { transform: item } });
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);

    const tableList = [];
    const start = newPage * 5;
    for (let i = start; i < start + 5; i++) {
      if (i < transformList.length) {
        const res = await axios.get(
          `${SERVICE}/transforms/${transformList[i].id}`
        );
        if (res.status === 200) {
          let tableData = {...res.data.Item}
          tableData.TRANSFORM_ID = transformList[i].id
          tableList.push(tableData);
        } else {
          tableList.push({});
        }
      }
    }
    setTransformListPerPage(tableList);
  };

  const openDialog = (item) => {
    const schemaList = [];
    for (let i = 0; i < item.length; i++) {
      const keys = Object.keys(item[i]);
      schemaList.push(keys[0]);
    }
    setSchema(schemaList);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  if (isLoad) {
    return (
      <section className="grid grid-cols-12">
        {/* <IconButton onClick={toggleSlider}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleSlider}>
        {sideList()}
      </Drawer> */}

        <div className="hidden md:flex md:col-span-3 lg:col-span-2 xl:col-span-2">
          <Sidebar page={`transform`} />
        </div>
        <div className="contentBox">
          <p className="text-4xl">Transforms</p>
          <p className="text-md pt-1">Transform / Lists</p>

          <Button
            variant="contained"
            className="createButton"
            onClick={() => createTransform()}
          >
            Create Transform
          </Button>

          <TableContainer component={Paper} className="mt-8">
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Transform Tag</TableCell>
                  <TableCell>Source PK</TableCell>
                  <TableCell>Schema</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transformListPerPage.map((row, index) => (
                  <TableRow
                    key={`pipelineList-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.TAGS}
                    </TableCell>
                    <TableCell>{row.PK}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => openDialog(row.SCHEMAS)}>
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => executeTransform(row)}>
                        Execute
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5]}
                    colSpan={3}
                    count={transformList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
        <ToastContainer position="bottom-right" />
        {schema.length > 0 ? (
          <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
          >
            <DialogTitle>
              {'Schema'}
            </DialogTitle>
            <DialogContent>
              <Stack>
              {schema.map((item, index) => (
                <p key={`schema-${index}`}>{item}</p>
              ))}
              </Stack>
            </DialogContent>
          </Dialog>
        ) : null}
      </section>
    );
  } else {
    return (
      <>
        <ToastContainer position="bottom-right" />
      </>
    );
  }
}

export default Transform;
