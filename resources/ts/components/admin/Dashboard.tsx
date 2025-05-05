import React from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import {
    Description as TemplatesIcon,
    FileCopy as CertificatesIcon,
} from "@mui/icons-material";

import {
    useNotifications,
} from "@toolpad/core/useNotifications";
import Button from "@mui/material/Button";

function NotifyButton() {
    const notifications = useNotifications();
    const [online, setOnline] = React.useState(true);
    const prevOnline = React.useRef(online);
    React.useEffect(() => {
        if (prevOnline.current === online) {
            return () => {};
        }
        prevOnline.current = online;

        // preview-start
        const key = online
            ? notifications.show("You are now online", {
                  severity: "success",
                  autoHideDuration: 3000,
              })
            : notifications.show("You are now offline", {
                  severity: "error",
              });

        return () => {
            notifications.close(key);
        };
        // preview-end
    }, [notifications, online]);

    return <Button onClick={() => setOnline((prev) => !prev)}>Notify</Button>;
}

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
                مرحباً بكم في نظام إدارة الشهادات
            </Typography>
            <Typography color="textSecondary" component="p">
                قم بإنشاء وإدارة قوالب الشهادات الخاصة بك وإنشاء شهادات
                للمستلمين.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Card>
                        <CardContent
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <TemplatesIcon fontSize="large" color="primary" />
                            <Box>
                                <Typography variant="h5" component="div">
                                    {stats.totalTemplates}
                                </Typography>
                                <Typography color="textSecondary">
                                    قوالب الشهادات
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Card>
                        <CardContent
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <CertificatesIcon
                                fontSize="large"
                                color="primary"
                            />
                            <Box>
                                <Typography variant="h5" component="div">
                                    {stats.totalCertificates}
                                </Typography>
                                <Typography color="textSecondary">
                                    إجمالي الشهادات
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    إجراءات سريعة
                </Typography>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="body1">
                        ابدأ بإنشاء قالب شهادة جديد أو إنشاء شهادات للمستلمين.
                    </Typography>
                </Paper>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    إشعارات
                </Typography>
                <Paper sx={{ p: 3 }}>
                    <NotifyButton />
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;
