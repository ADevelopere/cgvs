import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../../utils/axios';
import {
  Box,
  Tab,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { setActiveTab, selectActiveTab, selectUnsavedChanges, setTabError } from '../../../../store/templateManagementSlice';

const handleTabError = (error, tab, dispatch) => {
  if (error.response?.status === 403) {
    dispatch(setTabError({ tab, error: 'Access denied to this tab' }));
    return;
  }
  
  dispatch(setTabError({ 
    tab, 
    error: error.response?.data?.message || 'An error occurred loading this tab' 
  }));
};
import HeaderActions from '../common/HeaderActions';
import BasicInfoTab from './tabs/BasicInfoTab';
import VariablesTab from './tabs/VariablesTab';
import EditorTab from './tabs/EditorTab';
import RecipientsTab from './tabs/RecipientsTab';
import PreviewTab from './tabs/PreviewTab';

const Management = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = useSelector(selectActiveTab);
  const hasUnsavedChanges = useSelector(selectUnsavedChanges);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'basic';
    dispatch(setActiveTab(tab));
  }, [searchParams, dispatch]);

  const handleTabChange = async (event, newValue) => {
    try {
      // Call the API with the new tab parameter to check permissions
      await axios.get(`/api/admin/templates/${id}?tab=${newValue}`);
      setSearchParams({ tab: newValue });
    } catch (error) {
      handleTabError(error, newValue, dispatch);
    }
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
            <HeaderActions
            onPreview={() => {
              // TODO: Implement preview functionality
            }}
            onSave={() => {
              // TODO: Implement save functionality
            }}
          />
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
          <VariablesTab />
        </TabPanel>
        <TabPanel keepMounted value="editor">
          <EditorTab />
        </TabPanel>
        <TabPanel keepMounted value="recipients">
          <RecipientsTab />
        </TabPanel>
        <TabPanel keepMounted value="preview">
          <PreviewTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Management;
