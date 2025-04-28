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
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/dateUtils';
import PropTypes from 'prop-types';

const ListView = ({ templates }) => {
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
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/templates/${template.id}/edit`)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<PreviewIcon />}
                  onClick={() => navigate(`/admin/templates/${template.id}/preview`)}
                >
                  Preview
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ListView.propTypes = {
  templates: PropTypes.array.isRequired,
};

export default ListView;
