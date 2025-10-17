"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import RecipientGroupItem from "./RecipientGroupItem";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface RecipientGroupListProps {
    groups: Graphql.TemplateRecipientGroup[];
    loading?: boolean;
}

const RecipientGroupList: React.FC<RecipientGroupListProps> = ({ groups, loading = false }) => {
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!groups || groups.length === 0) {
        return null;
    }

    return (
        <Box sx={{ width: "100%" }}>
            {groups.map((group) => (
                <RecipientGroupItem key={group.id} group={group} />
            ))}
        </Box>
    );
};

export default RecipientGroupList;
