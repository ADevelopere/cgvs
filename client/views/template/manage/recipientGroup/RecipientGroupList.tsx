"use client";

import React from "react";
import { Box } from "@mui/material";
import RecipientGroupItem from "./RecipientGroupItem";
import { useRecipientGroupDataStore } from "./stores/useRecipientGroupDataStore";

const RecipientGroupList: React.FC = () => {
    const { groups } = useRecipientGroupDataStore();

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
