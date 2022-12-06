import React, { useEffect, useState } from "react";
import {
    Box, Card, Grid, Table, TableBody, TableCell, TableHead, Pagination,
    TableRow, Hidden, IconButton, Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import FloatingButton from "components/FloatingButton";
// import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AttendanceSelector, GeneralSelector, UserSelector } from "selectors";
// import moment from "moment";
import { Delete } from "@mui/icons-material";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { AttendanceActions, GeneralActions, UserActions } from "slices/actions";
import { DefaultSort } from "constants/sort";
import { toast } from "react-toastify";
import DialogConfirm from "components/DialogConfirm";
// import SelectField from "components/SelectField";
import Can from "utils/can";
import { actions, features } from "constants/permission";
// import { Autocomplete } from "@mui/lab";
import ListSkeleton from "../../components/Skeleton/ListSkeleton";
// import CustomMenu from "../../components/CustomMenu";
import { get, del } from "../../utils/api";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Modal from 'react-modal';
import CloseIcon from "@mui/icons-material/Close";

const FilterBox = styled(Box)(() => ({
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
}));

export default function PrivacyPolicy() {
    // const history = useHistory();
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    // const users = useSelector(UserSelector.getUsers());
    // const attendances = useSelector(AttendanceSelector.getAttendances());
    const loading = useSelector(GeneralSelector.loader(AttendanceActions.getAttendances.type));
    const pagination = useSelector(AttendanceSelector.getPagination());
    const success = useSelector(GeneralSelector.success(AttendanceActions.deleteAttendance.type));
    const [policyData, setPolicyData] = useState();
    const API_URL = process.env.REACT_APP_API_URL ?? "https://server1.rachana.tk/api/";
    const PDF_URL = process.env.REACT_APP_API_URL ?? "https://server1.rachana.tk/";
    let adminFlag = false;
    if (profile?.role?.toString() === 'admin' || profile?.role?.toString() === 'humanresource,manager') {
        adminFlag = true;
    }
    console.log(adminFlag, "profile=", profile?.role?.toString())

    // const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState({
        sort: DefaultSort.newest.value,
        page: 1
    });
    const [selected, setSelected] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [payslipFile, setPayslipFile] = useState([]);
    const customStyles = {
        content: {
            width: '40%',
            height: '50%',
            minWidth: '40%',
            minHeight: '50%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    useEffect(() => {
        dispatch(UserActions.getUsers());
    }, []);

    useEffect(() => {
        if (filter.user === -1) {
            delete filter.user;
        }

        dispatch(AttendanceActions.getAttendances(filter));
    }, [filter]);

    useEffect(() => {
        if (profile && Can(actions.readSelf, features.attendance)) {
            setFilter({
                ...filter,
                user: profile._id
            });
        }
    }, [profile]);

    useEffect(() => {
        if (success) {
            setConfirmDelete(false);
            setSelected(null);

            toast.success(`${success?.message ?? "Success"}`, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: false
            });

            dispatch(GeneralActions.removeSuccess(AttendanceActions.deleteAttendance.type));
            dispatch(AttendanceActions.getAttendances(filter));
        }
    }, [success]);

    // const handleChangeFilter = ({ target }) => {
    //     const { name, value } = target;

    //     setFilter({
    //         ...filter,
    //         [name]: value
    //     });
    // }

    const handleFileChange = (e) => {
        setPayslipFile(e.target.files);
    }

    const handleChangePagination = (e, val) => {
        setFilter({
            ...filter,
            page: val
        });
    };

    const handleDelete = async () => {
        await del(`${API_URL}/policy/${selected}`).
            then((res) => {
                console.log("=deletion response=", res);
                setConfirmDelete(false);
            }).
            catch((err) => {
                console.log("=err deletion=", err.data.message);
                setConfirmDelete(false);
            });
    }
    const handleSubmit = () => {
        const token = localStorage.getItem("merakihr-token");
        const formData = new FormData();
        /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/
        for (let i = 0; i < payslipFile.length; i++) {
            formData.append("files", payslipFile[i]);
        }
        const apiCall = axios({ method: "post", url: `${API_URL}/policy`, data: formData, headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, }).
            then(async (res) => {
                console.log("=res save=", res);
                setModalIsOpen(false)
                const paySlipResponse = await get(`${API_URL}/policy?page=1&limit=20`);
                setPolicyData(paySlipResponse?.data?.data);
            }).
            catch((err) => {
                console.log("=err save=", err, apiCall);
            })
    }
    useEffect(async () => {
        const paySlipResponse = await get(`${API_URL}/policy?page=1&limit=20`);
        setPolicyData(paySlipResponse?.data?.data);
    }, []);

    return (
      <Card>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Privacy Policy
        </Typography>
        <FilterBox>
          <Grid container spacing={3} justifyContent="space-between">
            {/* {Can(actions.readAll, features.attendance) && (
                        <Grid item lg={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Typography variant='caption'>Employee</Typography>
                                <Autocomplete
                                    disablePortal
                                    options={users}
                                    value={selectedUser ?? ''}
                                    onChange={(e, val) => {
                                        setSelectedUser(val);
                                        handleChangeFilter({
                                            target: {
                                                name: 'user',
                                                value: val ? val._id : -1
                                            }
                                        });
                                    }}
                                    getOptionLabel={(option) => option.name ?? ''}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderInput={(params) => <InputBase {...params.InputProps} {...params} />}
                                />
                            </FormControl>
                        </Grid>
                    )} */}
            {/* <Grid item lg={2} sm={12} xs={12}>
                        <SelectField
                            label="Sort"
                            name='sort'
                            value={filter.sort}
                            onChange={handleChangeFilter}>
                            {Object.keys(DefaultSort).map((key) => (
                                <MenuItem key={key} value={DefaultSort[key].value}>
                                    {DefaultSort[key].name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid> */}
          </Grid>
        </FilterBox>

        {loading ? (
          <ListSkeleton />
        ) : (
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <Hidden smDown>
                    <TableCell>Name</TableCell>
                    <TableCell>File</TableCell>
                    {adminFlag && <TableCell>Action</TableCell>}
                  </Hidden>
                  {/* <TableCell align="right">Option</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {attendances.length === 0 && (
                                <TableRow>
                                    <TableCell align="center" colSpan={5}>
                                        No Data
                                    </TableCell>
                                </TableRow>
                            )} */}

                {/* !policyData... */}
                {policyData ? (
                  policyData?.map((item, key) => (
                    <TableRow
                      key={key}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>
                        {item.originalName.charAt(0).toUpperCase() +
                          item.originalName.slice(1).replace(".pdf", "")}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            window.open(PDF_URL + item.path);
                          }}
                        >
                          <PictureAsPdfOutlinedIcon />
                        </IconButton>
                        {/* <a href={PDF_URL + item.path} target='_blank' rel='noopener noreferrer'><PictureAsPdfOutlinedIcon /></a> */}
                      </TableCell>
                      {adminFlag && (
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setConfirmDelete(true);
                              setSelected(item._id);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      No Data
                    </TableCell>
                  </TableRow>
                )}
                {/* end! */}
                {/* {attendances.map((item, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.user?.name}<br />
                                        <Hidden smUp>
                                            <Typography variant='caption'>
                                                In:  {item.checkIn ? moment(item.checkIn).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                            </Typography><br />
                                            <Typography variant='caption'>
                                                Out:  {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                            </Typography>
                                        </Hidden>
                                    </TableCell>
                                    <Hidden smDown>
                                        <TableCell>
                                            {item.checkIn ? moment(item.checkIn).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                        </TableCell>
                                    </Hidden>
                                    <TableCell align="right">
                                        <Hidden smDown>
                                            {!item.checkOut && (
                                                <IconButton
                                                    onClick={() => history.push(`/app/attendance/update/${item._id}`)}>
                                                    <Edit />
                                                </IconButton>
                                            )}
                                            <IconButton onClick={() => {
                                                setConfirmDelete(true);
                                                setSelected(item._id);
                                            }}>
                                                <Delete />
                                            </IconButton>
                                        </Hidden>
                                        <Hidden smUp>
                                            <CustomMenu>
                                                {!item.checkOut && (
                                                    <MenuItem onClick={() => history.push(`/app/attendance/update/${item._id}`)}>
                                                        <ListItemIcon>
                                                            <Visibility fontSize="small" />
                                                        </ListItemIcon>
                                                        Detail
                                                    </MenuItem>
                                                )}
                                                <MenuItem
                                                    onClick={() => {
                                                        setConfirmDelete(true);
                                                        setSelected(item._id);
                                                    }}>
                                                    <ListItemIcon>
                                                        <Delete fontSize="small" />
                                                    </ListItemIcon>
                                                    Delete
                                                </MenuItem>
                                            </CustomMenu>
                                        </Hidden>
                                    </TableCell>
                                </TableRow>
                            ))} */}
              </TableBody>
            </Table>

            <Pagination
              sx={{ mt: 1 }}
              page={filter.page}
              count={pagination.pages}
              onChange={handleChangePagination}
            />
          </Box>
        )}
        {adminFlag && <FloatingButton onClick={() => setModalIsOpen(true)} />}

        <DialogConfirm
          title="Delete Policy"
          content="Are you sure want to delete this Policy?"
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onSubmit={handleDelete}
        />
        {modalIsOpen && (
          <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={() => setModalIsOpen(false)}
            style={customStyles}
            contentLabel="Add Pay Slip"
          >
            <Button
              onClick={() => setModalIsOpen(false)}
              style={{ boxShadow: "none", float: "right", minWidth: "auto" }}
            >
              <CloseIcon />
            </Button>
            {/* <form> */}
            <Grid container spacing={3}>
              <Grid item lg={12} sm={12} xs={12}>
                <Typography variant="caption">Upload File</Typography>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e)}
                  />
                </Form.Group>
              </Grid>
              <Grid item lg={12} sm={12} xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={(e) => handleSubmit(e)}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            {/* </form> */}
          </Modal>
        )}
      </Card>
    );
}