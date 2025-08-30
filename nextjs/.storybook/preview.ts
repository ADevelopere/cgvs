import type { Preview } from "@storybook/nextjs";
import withGlobalStyles from "../stories/Decorators";

const preview: Preview = {
    decorators: [withGlobalStyles],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            test: "todo",
        },
        // Enable Next.js app directory features
        nextjs: {
            appDirectory: true,
        },
    },
};

export default preview;
