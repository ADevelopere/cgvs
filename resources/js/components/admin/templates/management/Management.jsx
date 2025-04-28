import { useState } from 'react';
import {
  Box,
  Tab,
  Paper,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import BasicInfoTab from './tabs/BasicInfoTab';

const Management = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" component="h1">
            Template Management
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Tabs */}
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="template management tabs">
            <Tab label="Basic Info" value="basic" />
            <Tab label="Variables" value="variables" />
            <Tab label="Editor" value="editor" />
            <Tab label="Recipients" value="recipients" />
            <Tab label="Preview" value="preview" />
          </TabList>
        </Box>

        <TabPanel keepMounted value="basic">
          <BasicInfoTab />
        </TabPanel>
        <TabPanel keepMounted value="variables">
          Variables Tab Content (Coming Soon)
        </TabPanel>
        <TabPanel keepMounted value="editor">
          Editor Tab Content (Coming Soon)
        </TabPanel>
        <TabPanel keepMounted value="recipients">
          Recipients Tab Content (Coming Soon)
        </TabPanel>
        <TabPanel keepMounted value="preview">
          Preview Tab Content (Coming Soon)
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Management;
