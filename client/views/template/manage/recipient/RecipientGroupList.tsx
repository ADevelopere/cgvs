"use client";

import React from "react";
import { Box } from "@mui/material";
import RecipientGroupItem from "./RecipientGroupItem";
import { Template } from "@/client/graphql/generated/gql/graphql";

const RecipientGroupList: React.FC = () => {
    const template: Template = {
        id: 1,
        name: "Test Template",
        recipientGroups: [],
    } as Template;

    if (!template?.recipientGroups || template.recipientGroups.length === 0) {
        return null;
    }

    return (
        <Box sx={{ width: "100%" }}>
            {template.recipientGroups.map((group) => (
                <RecipientGroupItem key={group.id} group={group} />
            ))}
        </Box>
    );
};

export default RecipientGroupList;
