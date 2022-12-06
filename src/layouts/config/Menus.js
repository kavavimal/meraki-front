import React from "react";
import {
    AccountBalance,
    AccountBalanceWallet,
    AccountTree, Assignment, AssignmentIndOutlined, CalendarToday,
    Dashboard,
    People, Settings
} from "@mui/icons-material";
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import { actions, features } from "../../constants/permission";

const Menus = [
    { name: "Dashboard", icon: <Dashboard />, path: "/app/dashboard", act: actions.readAll, feat: 'All' },
    { name: "Employee", icon: <People />, path: "/app/user", act: actions.read, feat: features.user },
    { name: "Department", icon: <AccountBalance />, path: "/app/department", act: actions.read, feat: features.department },
    { name: "Designation", icon: <AccountTree />, path: "/app/designation", act: actions.read, feat: features.designation },
    { name: "Attendance", icon: <CalendarToday />, path: "/app/attendance", act: actions.readAll, feat: 'All' },
    { name: "Payslip", icon: <ReceiptOutlinedIcon />, path: "/app/payslip", act: actions.read, feat: features.payslip },
    
    { name: "Documents", icon: <DocumentScannerOutlinedIcon />, path: "/app/documents", act: actions.read, feat: features.payslip },

    { name: "Expenses", icon: <AccountBalanceWallet />, path: "/app/expenses", act: actions.read, feat: features.expense },
    { name: "Leave", icon: <AssignmentIndOutlined />, path: "/app/leave", act: actions.readAll, feat: 'All' },
    { name: "Report", icon: <Assignment />, path: "/app/report", act: actions.read, feat: features.report },
    { name: "Settings", icon: <Settings />, path: "/app/setting", act: actions.update, feat: features.setting },
    { name: "Privacy Policy", icon: <PrivacyTipOutlinedIcon />, path: "/app/policy", act: actions.readAll, feat: 'All' },
];

export default Menus;
