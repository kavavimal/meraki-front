import { AccountCircleOutlined, AssignmentOutlined, DraftsOutlined, InsertDriveFileOutlined } from "@mui/icons-material";
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import BasicInformation from "../components/Form/BasicInformation";
import AccountSetting from "../components/Form/AccountSetting";
import LeaveHistory from "../components/Form/Leave";
import PaySlip from "../components/Form/PaySlip";
import UserDocuments from "../components/Form/UserDocuments";
import Attendance from "../components/Form/Attendance";

const menus = [
    {
        id: 'basic',
        name: 'Basic Information',
        icon: InsertDriveFileOutlined,
        component: BasicInformation
    },
    {
        id: 'account',
        name: 'Account Setting',
        icon: AccountCircleOutlined,
        component: AccountSetting
    },
    {
        id: 'attendance',
        name: 'Attendance',
        icon: AssignmentOutlined,
        component: Attendance
    },
    {
        id: 'leave',
        name: 'Leave',
        icon: DraftsOutlined,
        component: LeaveHistory
    },
    {
        id: 'payslip',
        name: 'Pay Slip',
        icon: ReceiptOutlinedIcon,
        component: PaySlip
    },
    {
        id: 'documents',
        name: 'Documents',
        icon: DocumentScannerOutlinedIcon,
        component: UserDocuments
    }
];

export default menus;