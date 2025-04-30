import { useSearchParams } from "react-router-dom";
import {
    Box,
    Tab,
    Paper,
    Typography,
    Stack,
    CircularProgress,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
    useTemplateManagement,
    TabType,
} from "@/contexts/template/TemplateManagementContext";
import BasicInfoTab from "./BasicInfoTab";
import VariablesTab from "./variables/VariablesTab";
import EditorTab from "./tabs/EditorTab";
import RecipientsTab from "./tabs/RecipientsTab";
import PreviewTab from "./tabs/PreviewTab";
import { Template } from "@/contexts/template/template.types";
import { TemplateVariablesProvider } from "@/contexts/template/TemplateVariablesContext";

const template: Template = {
    id: 1,
    name: "",
    is_active: false,
    created_at: "",
    updated_at: "",
};

const handleTabError = (
    error: any,
    tab: TabType,
    setTabError: (tab: TabType, error: { message: string }) => void
) => {
    if (error.response?.status === 403) {
        setTabError(tab, { message: "Access denied to this tab" });
        return;
    }

    setTabError(tab, {
        message:
            error.response?.data?.message ||
            "An error occurred loading this tab",
    });
};

const Management: React.FC = () => {
    const [_, setSearchParams] = useSearchParams();
    const { activeTab, setTabError, loading } = useTemplateManagement();

    const handleTabChange = async (
        _: React.SyntheticEvent,
        newValue: TabType
    ) => {
        try {
            //todo: remove this
            // await axios.get(`/api/admin/templates/${id}?tab=${newValue}`);
            setSearchParams({ tab: newValue });
        } catch (error) {
            handleTabError(error, newValue, setTabError);
        }
    };

    return (
        <TemplateVariablesProvider>
            <Box sx={{ width: "100%" }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="h1">
                        Template Management
                    </Typography>
                </Box>
                {/* Tabs */}
                <TabContext value={activeTab}>
                    <Paper>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                                onChange={handleTabChange}
                                aria-label="template management tabs"
                            >
                                <Tab label="Basic Info" value="basic" />
                                <Tab label="Variables" value="variables" />
                                <Tab label="Editor" value="editor" />
                                <Tab label="Recipients" value="recipients" />
                                <Tab label="Preview" value="preview" />
                            </TabList>
                        </Box>
                    </Paper>

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
