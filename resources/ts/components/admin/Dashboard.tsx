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

interface DashboardStats {
  totalTemplates: number;
  totalCertificates: number;
}

const Dashboard: React.FC = () => {
  // TODO: Replace with real data from API
  const stats: DashboardStats = {
    totalTemplates: 5,
    totalCertificates: 123,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to CGVS
      </Typography>
      <Typography color="textSecondary" component="p">
        Create and manage your certificate templates and generate certificates for your recipients.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TemplatesIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="h5" component="div">
                  {stats.totalTemplates}
                </Typography>
                <Typography color="textSecondary">
                  Certificate Templates
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CertificatesIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="h5" component="div">
                  {stats.totalCertificates}
                </Typography>
                <Typography color="textSecondary">
                  Total Certificates
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Get started by creating a new certificate template or generating certificates for your recipients.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
