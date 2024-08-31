import {Box} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
const Topbar = () => {

  return (
    <Box display="flex" justifyContent="space-between" p={2}>

              <Item
              title={t('logout')}
              to="/"
              icon={<LogoutOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />      
  
    </Box>
  );
};

export default Topbar;