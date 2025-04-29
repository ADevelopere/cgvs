import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Description as TemplatesIcon,
  FileCopy as CertificatesIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // TODO: Replace with real data from API
  const stats = {
    totalTemplates: 0,
    totalCertificates: 0,
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TemplatesIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Templates</Typography>
              </Box>
              <Typography variant="h4">{stats.totalTemplates}</Typography>
              <Typography variant="body2" color="textSecondary">
                Total templates created
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CertificatesIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Certificates</Typography>
              </Box>
              <Typography variant="h4">{stats.totalCertificates}</Typography>
              <Typography variant="body2" color="textSecondary">
                Total certificates generated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Typography color="textSecondary">
            No recent activity to display.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
