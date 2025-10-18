import { Box, Skeleton } from "@mui/material";

export const TemplateContentSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} />
    </Box>
  );
};
