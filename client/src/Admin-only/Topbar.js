import { useContext } from "react";
import {Box, Button} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { AuthContext } from "../AuthProvider";
import { grey } from "@mui/material/colors";
const Topbar = () => {

  const {logout} = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
   
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>

          <Button sx={{backgroundColor: '#424242'}}startIcon= {<LogoutOutlinedIcon />} onClick={handleLogout}>
                Logout
              </Button>
        
    </Box>
  );
};

export default Topbar;