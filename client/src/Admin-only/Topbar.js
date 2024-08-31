import {Box} from "@mui/material";
import { Link } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
const Topbar = () => {

  return (
    <Box display="flex" justifyContent="space-between" p={2}>

         <Link to="/logout" > Log Out </Link>
          
  
    </Box>
  );
};

export default Topbar;