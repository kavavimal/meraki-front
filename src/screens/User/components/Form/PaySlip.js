import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Grid,
} from "@mui/material";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { LeaveSelector } from "../../../../selectors";
import { LeaveActions } from "../../../../slices/actions";
import { styled } from "@mui/material/styles";
import moment from "moment";
// import { push } from "connected-react-router";
import PropTypes from "prop-types";
import { get, del } from "../../../../../src/utils/api";
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import DialogConfirm from "components/DialogConfirm";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const Header = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
}));

LeaveHistory.propTypes = {
    user: PropTypes.object
};

export default function LeaveHistory({ user }) {
    const dispatch = useDispatch();
    const leaves = useSelector(LeaveSelector.getLeaves());
    const [payslipData, setPayslipData] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [toDate, setToDate] = useState(new Date());
    const [payslipFile, setPayslipFile] = useState();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selected, setSelected] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL ?? "https://server1.rachana.tk/api";
    const PDF_URL = process.env.REACT_APP_API_URL ?? "https://server1.rachana.tk/";
   
    const customStyles = {
        content: {
            width: '40%',
            height: '60%',
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
        dispatch(LeaveActions.getLeaves({
            user: user._id
        }))
    }, []);

    useEffect(async () => {
        let filteredPayslipData = '';
        const paySlipResponse = await get(`${API_URL}/payslip`);
        filteredPayslipData = paySlipResponse?.data?.data?.filter((item) => (
            item?.employee === user?._id
        ));
        setPayslipData(filteredPayslipData);
    }, []);

    const handleDelete = async () => {
        await del(`${API_URL}/payslip/${selected}`).
            then((res) => {
                console.log("=deletion response=", res);
                setConfirmDelete(false);
            }).
            catch((err) => {
                console.log("=err deletion=", err.data.message);
                setConfirmDelete(false);
            });
    }

    const handleFileChange = (e) => {
        setPayslipFile(e.target.files[0]);
        console.log(payslipFile, "=handlechanzefile=", e.target.result);
    }

    const handleSubmit = () => {
        const token = localStorage.getItem("merakihr-token");
        const formData = new FormData();
        formData.append('month', moment(toDate).format('MMMM'));
        formData.append('year', moment(toDate).year());
        formData.append('file', payslipFile ? payslipFile : "")
        formData.append('employeeId', user?._id)
        const apiCall = axios({ method: "post", url: `${API_URL}/payslip`, data: formData, headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, }).
            then(async (res) => {
                console.log("=res save=", res);
                setModalIsOpen(false)
                let filteredPayslipData = '';
                const paySlipResponse = await get(`${API_URL}/payslip`);
                filteredPayslipData = paySlipResponse?.data?.data?.filter((item) => (
                    item?.employee === user?._id
                ));
                setPayslipData(filteredPayslipData);
            }).
            catch((err) => {
                console.log("=err save=", err, apiCall);
            })
    }
    return (
      <Card>
        <Header>
          <Typography variant="h5">Pay Slip</Typography>
          {/* <Button
                    variant='contained'
                    color='primary'
                    onClick={() => dispatch(push('/app/leave/create'))}>Add</Button> */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalIsOpen(true)}
          >
            Add
          </Button>
        </Header>
        {modalIsOpen && (
          <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={() => setModalIsOpen(false)}
            style={customStyles}
            contentLabel="Add Pay Slip"
          >
            {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
            {/* <button onClick={() => setModalIsOpen(false)}>close</button> */}
            <Button
              onClick={() => setModalIsOpen(false)}
              style={{ boxShadow: "none", float: "right", minWidth: "auto" }}
            >
              <CloseIcon />
            </Button>{" "}
            {/* <form> */}
            <Grid container spacing={3}>
              <Grid item lg={12} sm={12} xs={12}>
                <Typography variant="caption">Month/Year</Typography>
                <Form.Group className="mb-3 cursor-pointer MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-9z687a-MuiInputBase-root">
                  <DatePicker
                    name="toDate"
                    selected={toDate}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    onChange={(date) => setToDate(date)}
                    className="border-0 cursor-pointer MuiInputBase-input css-r6v5yu-MuiInputBase-input"
                  />
                </Form.Group>
              </Grid>
              <Grid item lg={12} sm={12} xs={12} className="mb-1">
                <Typography variant="h5">Upload File</Typography>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                    className=""
                  />
                </Form.Group>
              </Grid>
              <Grid item lg={12} sm={12} xs={12} className="">
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
            {/* <label>Month/Year</label>
                    <DatePicker
                        name="toDate"
                        selected={toDate}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        onChange={(date) => setToDate(date)} /> */}
            {/* <label>File</label> */}
            {/* </form> */}
          </Modal>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Month/Year</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {leaves.length === 0 && (
                            <TableRow>
                                <TableCell align="center" colSpan={4}>
                                    No Data
                                </TableCell>
                            </TableRow>
                        )} */}
              {payslipData ? (
                payslipData?.map((item, key) => (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{key + 1}</TableCell>
                    <TableCell>
                      {item?.originalName.charAt(0).toUpperCase() +
                        item?.originalName.slice(1).replace(".pdf", "")}
                    </TableCell>
                    <TableCell>
                      {item?.month.charAt(0).toUpperCase() +
                        item?.month.slice(1)}{" "}
                      - {item?.year}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          window.open(PDF_URL + item?.path);
                        }}
                      >
                        <PictureAsPdfOutlinedIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          // handleDelete(item._id);
                          setConfirmDelete(true);
                          setSelected(item._id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                      {/* <Button
                                        variant='outlined'
                                        color='error'
                                        size='small'
                                        onClick={() => handleDelete(item._id)}><Delete fontSize="small" /></Button> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    No Data
                  </TableCell>
                </TableRow>
              )}
              {leaves.map((item, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell></TableCell>
                  <TableCell>
                    {item.break ? moment(item.break).format("ddd, DD MMM, HH:mm:ss") : "-"}
                  </TableCell>
                  <TableCell>
                    {item.back ? moment(item.back).format("ddd, DD MMM, HH:mm:ss") : "-"}
                  </TableCell>
                  <TableCell>
                    {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <DialogConfirm
          title="Delete Payslip"
          content="Are you sure want to delete this Payslip?"
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onSubmit={handleDelete}
        />
      </Card>
    );
}