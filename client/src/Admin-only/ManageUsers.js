import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext } from '../../../context/AuthProvider';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
const ManageUsers = () => {

   
  const {auth, checkAdmin} = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);


  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await api.get('/api/users/manage-users');
        setUsers(data.map((user) => ({ ...user, id: user.id })));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  const handleAction = async (id, action) => {
    if(!checkAdmin()){
      console.error('Unauthorized');
      return;
    }
    try {
      let url = `/api/users/${id}`;
      const body = {};

      if (action === 'block' || action === 'unblock') {
        url += '/block-toggle';
      } else if (action === 'promote' || action === 'demote') {
        url += '/updateRole';
        body.role = action === 'promote' ? 'admin' : 'user';
      } else if (action === 'delete') {
        setDeleteUserId(id);
        setConfirmDeleteOpen(true);
        return; // Do not proceed with the delete immediately
      }

      if (action !== 'delete') {
        await api.put(url, body, { withCredentials: true });

        setUsers(users.map(user => {
          if (user.id === id) {
            return {
              ...user,
              status: action === 'block' ? 'blocked' : 'active',
              role: body.role || user.role
            };
          }
          return user;
        }));

        if (action === 'demote' && id === auth.id) {
          api.post('/api/users/logout');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/users/${deleteUserId}/delete`);
      setUsers(users.filter(user => user.id !== deleteUserId));
      setConfirmDeleteOpen(false);
      setDeleteUserId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const handleDialogClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteUserId(null);
  };

  const columns = [
    { field: 'userName', headerName: t('name'), flex: 1, cellClassName: 'name-column--cell', headerAlign: 'center',
      align: 'center' },
    { field: 'email', headerName: t('email'), flex: 1, headerAlign: 'center',
      align: 'center'},
    {
      field: 'role',
      headerName: t('access'),
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      renderCell: ({ row: { role } }) => (
        <Box
          width="40%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={
            role === 'admin'
              ? '#1de9b6'
              : '#00e5ff'
          }
          borderRadius="4px"
        >
          {role === 'admin' && <AdminPanelSettingsOutlinedIcon />}
          {role === 'user' && <LockOpenOutlinedIcon />}
          <Typography color={'#004d40'} sx={{ ml: '5px' }}>
            {role}
          </Typography>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: t('actions'),
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      renderCell: ({ row }) => (
        <Box>
          <Stack direction="row" spacing={1}>

            <Button
              variant="contained"
              onClick={() => handleAction(row.id, row.status === 'blocked' ? 'unblock' : 'block')}
            >
              {row.status === 'blocked' ? t('unblock') : t('block')}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleAction(row.id, row.role === 'user' ? 'promote' : 'demote')}
            >
              {row.role === 'user' ? t('promoteToAdmin') :t('removeFromAdmin')}
            </Button>
            <Button
              sx={{
                backgroundColor: '#c62828'
              }}
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => handleAction(row.id, 'delete')}
            >
              {t('delete')}
            </Button>
          </Stack>
        </Box>
      )
    }
  ];

  return (
    <Box m="8px" position="fixed" width="80%">
      <Header title= {t('userList')} subtitle={t('manageUsersofcollectionapp')} />
      <Box m="40px 0 0 0" height="70vh" sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none"
        },
        "& .name-column-cell": {
          colors: '#a5d6a7'
        },
        "& .MuiDataGrid-colummHeaders": {
          backgroundColor: '#40c4ff',
          borderBottom: "none"
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: '#9e9e9e'
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: '#607d8b'
        },


      }}>
        <DataGrid rows={users} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
      </Box>
      <ConfirmDeleteDialog open={confirmDeleteOpen} onClose={handleDialogClose} onConfirm={handleConfirmDelete} />

    </Box>
  );
};

export default ManageUsers;