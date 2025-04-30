import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from '@/utils/axios';
import {
  Box,
  Tab,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTemplateManagement, TabType } from '@/contexts/template/TemplateManagementContext';
import HeaderActions from './common/HeaderActions';
import BasicInfoTab from './BasicInfoTab';
import VariablesTab from './variables/VariablesTab';
import EditorTab from './tabs/EditorTab';
import RecipientsTab from './tabs/RecipientsTab';
import PreviewTab from './tabs/PreviewTab';
import { Template } from '@/contexts/template/template.types';
import { TemplateVariablesProvider } from '@/contexts/template/TemplateVariablesContext';

const handleTabError = (error: any, tab: TabType, setTabError: (tab: TabType, error: { message: string }) => void) => {
  if (error.response?.status === 403) {
    setTabError(tab, { message: 'Access denied to this tab' });
    return;
  }

  setTabError(tab, {
    message: error.response?.data?.message || 'An error occurred loading this tab'
  });
};

const Management: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    activeTab,
    setActiveTab,
    unsavedChanges,
    setTabError
  } = useTemplateManagement();

  useEffect(() => {
    const tab = (searchParams.get('tab') || 'basic') as TabType;
    setActiveTab(tab);
  }, [searchParams, setActiveTab]);

  const handleTabChange = async (event: React.SyntheticEvent, newValue: TabType) => {
    try {
      await axios.get(`/api/admin/templates/${id}?tab=${newValue}`);
      setSearchParams({ tab: newValue });
    } catch (error) {
      handleTabError(error, newValue, setTabError);
    }
  };

  const template: Template = {
    id: parseInt(id || '0', 10),
    name: '',
    is_active: false,
    created_at: '',
    updated_at: '',
  };

  return (
    <TemplateVariablesProvider>
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
            <VariablesTab template={template} />
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
    </TemplateVariablesProvider>
  );
};

export default Management;
