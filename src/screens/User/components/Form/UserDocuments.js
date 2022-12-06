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
    Grid
} from "@mui/material";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useDispatch } from "react-redux";
// import { LeaveSelector } from "../../../../selectors";
import { LeaveActions } from "../../../../slices/actions";
import { styled } from "@mui/material/styles";
// import moment from "moment";
// import { push } from "connected-react-router";
import PropTypes from "prop-types";
import { get, del } from "../../../../../src/utils/api";
import { Delete } from "@mui/icons-material";
import DialogConfirm from "components/DialogConfirm";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Modal from 'react-modal';
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
    // const leaves = useSelector(LeaveSelector.getLeaves());
    const API_URL = process.env.REACT_APP_API_URL ?? "https://server1.rachana.tk/api";
    const PDF_URL = process.env.REACT_APP_API_URL ?? "https://server1.rachana.tk/";
    const [userDocumentData, setUserDocumentData] = useState();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selected, setSelected] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [payslipFile, setPayslipFile] = useState([]);

    const customStyles = {
        content: {
            width: '40%',
            height: '40%',
            minWidth: '40%',
            minHeight: '40%',
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
        let filteredDocumentData = '';
        const userDocumentResponse = await get(`${API_URL}/user-document?page=1&limit=20`);
        filteredDocumentData = userDocumentResponse?.data?.data?.filter((item) => (
            item?.employee === user?._id
        ));
        setUserDocumentData(filteredDocumentData);
    }, []);

    const handleDelete = async () => {
        await del(`${API_URL}/user-document/${selected}`).
            then((res) => {
                console.log("=deletion response=", res);
                setConfirmDelete(false)
            }).
            catch((err) => {
                console.log("=err deletion=", err.data.message);
                setConfirmDelete(false)
            });
    }

    const handleFileChange = (e) => {
        setPayslipFile(e.target.files);
        console.log(payslipFile, "=handlechanzefile=", e.target.files);
    }

    const handleSubmit = () => {
        const token = localStorage.getItem("merakihr-token");
        const formData = new FormData();
        /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/
        for (let i = 0; i < payslipFile.length; i++) {
            formData.append("files", payslipFile[i]);
        }
        formData.append('employeeId', user?._id)
        const apiCall = axios({ method: "post", url: `${API_URL}/user-document`, data: formData, headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, }).
            then(async (res) => {
                console.log("=res save=", res);
                setModalIsOpen(false)
                let filteredDocumentData = '';
                const userDocumentResponse = await get(`${API_URL}/user-document?page=1&limit=20`);
                filteredDocumentData = userDocumentResponse?.data?.data?.filter((item) => (
                    item?.employee === user?._id
                ));
                setUserDocumentData(filteredDocumentData);
            }).
            catch((err) => {
                console.log("=err save=", err, apiCall);
            })
    }
    return (
      <Card>
        <Header>
          <Typography variant="h5">User Documents</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalIsOpen(true)}
          >
            Add
          </Button>
        </Header>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
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
              {userDocumentData ? (
                userDocumentData?.map((item, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {item?.originalName.charAt(0).toUpperCase() +
                        item?.originalName.slice(1).replace(".pdf", "")}
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
            </TableBody>
          </Table>
        </TableContainer>
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
        <DialogConfirm
          title="Delete Document"
          content="Are you sure want to delete this Document?"
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onSubmit={handleDelete}
        />
      </Card>
    );
}