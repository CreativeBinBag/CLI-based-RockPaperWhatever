import {Box, Button} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
const Topbar = () => {

  const {logout} = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
   
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>

          <Button startIcon= {<LogoutOutlinedIcon />} onClick={handleLogout}>
                Logout
              </Button>
        
    </Box>
  );
};

export default Topbar;