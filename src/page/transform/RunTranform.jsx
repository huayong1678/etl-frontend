import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { styled, Box } from "@mui/system";
import {
  Stack,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextareaAutosize,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Sidebar from "../../component/Sidebar";

import "../../assets/css/System.css";
import "react-toastify/dist/ReactToastify.min.css";

const SERVICE = process.env.REACT_APP_SERVICE;

const Backdrop = styled("div")`
  z-index: -10;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#fbfbf8",
    border: "1px solid #ced4da",
    fontSize: 15,
    padding: "4px 8px 4px 12px",

    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
  "& .MuiMenuItem": {
    root: {
      fontSize: 15,
      "&$selected": {
        fontSize: 15,
      },
    },
  },
}));

function RunTranform(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const [pipelineList, setPipelineList] = useState([]);
  const [pipeline, setPipeline] = useState("");

  const [header, setHeader] = useState("");
  const [tag, setTag] = useState("");

  const [sourceConnectText, setSourceConnectText] = useState("");
  const [destinationConnectText, setDestinationConnectText] = useState("");

  const [sourceColumnList, setSourceColumnList] = useState([]);
  const [sourceColumnPKList, setSourceColumnPKList] = useState([]);
  const [sourceColumnPK, setSourceColumnPK] = useState("");

  const [execute, setExecute] = useState(null);

  const [isLoad, setIsLoad] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isExecute, setIsExecute] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const transform = location.state.transform;

      try {
        const token = localStorage.getItem("cookies");
        if (!token) {
          navigate("/");
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.defaults.withCredentials = true;

        const transformRes = await axios.get(
          `${SERVICE}/execute/prepare-table/${transform.PIPELINE_ID}/${transform.TRANSFORM_ID}`
        );
        if (transformRes.status === 200) {
          if (transformRes.data.detail === "available") {
            setIsAvailable(true);
          } else {
            setIsAvailable(false);
          }
        } else {
          toast.error(`Prepare Table Error`);
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

  const backButtonHandler = () => {
    navigate("/transform");
  };

  const createTable = async () => {
    try {
      const transform = location.state.transform;

      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate("/");
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;

      const createTableData = {
        create_table: true,
        pk: transform.PK,
      };

      const applyTableRes = await axios.post(
        `${SERVICE}/execute/apply-table/${transform.PIPELINE_ID}/${transform.TRANSFORM_ID}`,
        createTableData
      );
      if (applyTableRes.status === 200) {
        toast.success(`Create Table Success`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        });

        const transformRes = await axios.get(
          `${SERVICE}/execute/prepare-table/${transform.PIPELINE_ID}/${transform.TRANSFORM_ID}`
        );
        if (transformRes.status === 200) {
          if (transformRes.data.detail === "available") {
            setIsAvailable(true);
          } else {
            setIsAvailable(false);
          }
        } else {
          toast.error(`Prepare Table Error`);
        }
      } else {
        toast.error(`Create Table Error`);
      }

      setIsLoad(true);
    } catch (e) {
      toast.error(`Error`);
    }
  };

  const backToTransformPage = () => {
    navigate("/transform");
  };

  const executeData = async () => {
    try {
      const transform = location.state.transform;

      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate("/");
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;

      setIsLoad(false);

      const executeRes = await axios.get(
        `${SERVICE}/execute/migrate/${transform.PIPELINE_ID}/${transform.TRANSFORM_ID}`
      );
      if (executeRes.status === 200) {
        setExecute(executeRes.data)
        setIsLoad(true);
        setIsExecute(true)
      } else {
        toast.error(`Execute Data Error`);
      }
    } catch (e) {
      toast.error(`Error`);
    }
  };

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
        <p className="text-md pt-1">Transform / Execute Transform</p>

        <form>
          <div className="pipelineBox">
            {isLoad ? (
              <>
                {!isAvailable ? (
                  <Stack
                    className="mx-auto flex justify-items-center items-center"
                    spacing={1}
                  >
                    <p className="text-lg">Destination Table Not Available!</p>
                    <p className="text-md">Do you want to create table?</p>
                    <Stack direction="row" spacing={1} className="mx-auto">
                      <Button
                        variant="contained"
                        className="float-right"
                        onClick={() => backToTransformPage()}
                      >
                        No
                      </Button>
                      <Button
                        variant="contained"
                        className="float-right"
                        onClick={() => createTable()}
                      >
                        Yes
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <>
                    {isExecute ? (
                      <Stack spacing={2}>
                        <Stack className="w-full text-left px-6">
                          <Stack direction="row" spacing={1} className="flex items-center">
                            <ImportExportIcon />
                            <p className="text-lg">Exported Data From Source</p>
                          </Stack>
                          <Stack className="px-6">
                            <p>Rows : {execute.export.rows}</p>
                            <p>Size : {execute.export.size}</p>
                            <Stack direction="row" className="flex items-center">
                              <AccessTimeIcon />
                              <p className="pl-1">Time : {execute.export.time}</p>
                            </Stack>
                          </Stack>
                        </Stack>

                        <Stack className="w-full text-left px-6">
                          <Stack direction="row" spacing={1} className="flex items-center">
                            <ImportExportIcon />
                            <p className="text-lg">Imported Data To Destination</p>
                          </Stack>
                          <Stack className="px-6">
                            <p>Rows : {execute.import.rows}</p>
                            <p>Size : {execute.import.size}</p>
                            <Stack direction="row" className="flex items-center">
                              <AccessTimeIcon />
                              <p className="pl-1">Time : {execute.import.time}</p>
                            </Stack>
                          </Stack>
                        </Stack>

                        <Stack className="w-full text-left px-8">
                          <Stack direction="row" spacing={1} className="flex items-center">
                            <CloudUploadIcon />
                            <p className="text-lg">Upload Data To Amazon S3</p>
                          </Stack>
                          <Stack className="px-4">
                            <p>Size : {execute.upload.size}</p>
                            <Stack direction="row" className="flex items-center">
                              <AccessTimeIcon />
                              <p className="pl-1">Time : {execute.upload.time}</p>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack
                        className="mx-auto flex justify-items-center items-center"
                        spacing={1}
                      >
                        <p className="text-lg">
                          Destination Table Is Available!
                        </p>
                        <p className="text-md">Do you want to execute?</p>
                        <Button
                          variant="contained"
                          className="float-right"
                          onClick={() => executeData()}
                        >
                          Execute
                        </Button>
                      </Stack>
                    )}
                  </>
                )}
              </>
            ) : (
              <CircularProgress className="mx-auto" />
            )}
          </div>

          <Stack className="mt-4 float-right" direction="row" spacing={2}>
            <Button
              variant="contained"
              className="float-right"
              onClick={() => backButtonHandler()}
            >
              Back
            </Button>
          </Stack>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </section>
  );
}

export default RunTranform;
