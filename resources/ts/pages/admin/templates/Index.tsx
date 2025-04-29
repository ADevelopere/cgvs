import React from "react";
import { Container } from "@mui/material";
import TemplateList from "@/components/admin/templates/list/TemplateList";

const TemplatesIndex: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <TemplateList />
        </Container>
    );
};

export default TemplatesIndex;
