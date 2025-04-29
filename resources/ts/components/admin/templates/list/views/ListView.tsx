import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateUtils';
import { Template } from '@/store/templateSlice';

interface ListViewProps {
  templates: Template[];
}

const ListView: React.FC<ListViewProps> = ({ templates }) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Background</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>
                <Avatar
                  variant="rounded"
                  src={template.background_url || '/placeholder.png'}
                  alt={template.name}
                  sx={{ width: 60, height: 40 }}
                />
              </TableCell>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.description}</TableCell>
              <TableCell>{formatDate(template.created_at)}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate(`/admin/templates/${template.id}/manage`)}
                >
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListView;
