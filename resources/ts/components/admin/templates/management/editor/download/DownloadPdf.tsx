import { Panel, useReactFlow } from "@xyflow/react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";

// Function to convert image URL to bytes
async function imageUrlToBytes(url: string): Promise<Uint8Array> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Uint8Array(await blob.arrayBuffer());
}

// Function to trigger PDF download
async function downloadPdf(pdfBytes: Uint8Array, filename: string = "reactflow.pdf") {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up
}

// A4 landscape dimensions in points (PDF standard unit)
// 1 point = 1/72 inch. A4 = 297mm x 210mm = 11.69in x 8.27in
const A4_WIDTH_PT = 11.69 * 72; // approx 842
const A4_HEIGHT_PT = 8.27 * 72; // approx 595

function DownloadPdf() {
    const { template } = useTemplateManagement();
    const [dimensions, setDimensions] = useState({
        width: A4_WIDTH_PT,
        height: A4_HEIGHT_PT,
    });

    useEffect(() => {
        if (template?.image_url) {
            const img = new Image();
            img.src = template.image_url;
            img.onload = () => {
                setDimensions({
                    width: img.width,
                    height: img.height,
                });
            };
        }
    }, [template?.image_url]);

    const theme = useTheme();
    const { getNodes, getEdges } = useReactFlow(); // Get flow data access

    const onClick = async () => {
        const nodes = getNodes();
        const edges = getEdges();

        const password = prompt("Enter a password to protect the PDF:");
        if (!password) {
            console.log("PDF generation cancelled: No password provided.");
            return;
        }

        try {
            const pdfDoc = await PDFDocument.create();
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Add a page with the correct dimensions
            const page = pdfDoc.addPage([dimensions.width, dimensions.height]);
            const { width, height } = page.getSize();

            // Handle background image first
            if (template?.image_url) {
                try {
                    // Convert image to bytes
                    const imageBytes = await imageUrlToBytes(template.image_url);
                    
                    // Determine image type and embed accordingly
                    let pdfImage;
                    if (template.image_url.toLowerCase().endsWith('.png')) {
                        pdfImage = await pdfDoc.embedPng(imageBytes);
                    } else {
                        pdfImage = await pdfDoc.embedJpg(imageBytes);
                    }

                    // Draw the background image
                    page.drawImage(pdfImage, {
                        x: 0,
                        y: 0,
                        width: dimensions.width,
                        height: dimensions.height,
                    });
                } catch (error) {
                    console.error("Error embedding background image:", error);
                }
            }

            // Draw nodes
            nodes.forEach(node => {
                // Skip background image node as we've already handled it
                if (node.type === 'image') return;
                
                const { position, data } = node;
                const label: string = data.label as string || 'Node';
                
                // Calculate Y position (PDF coordinates start from bottom-left)
                const pdfY = height - position.y - 20; // Adjusted for text height

                // Draw only the text without background rectangle
                page.drawText(label, {
                    x: position.x,
                    y: pdfY,
                    size: 12,
                    font: helveticaFont,
                    color: rgb(1, 1, 1),
                });
            });

            // --- Edge Drawing Logic (Optional, can be complex) ---
            // edges.forEach(edge => { ... draw lines/curves ... });


            // Encrypt the PDF
            // await pdfDoc.encrypt({
            //     userPassword: password,
            //     ownerPassword: password, // Often same as user password for simplicity
            //     permissions: {}, // Define permissions if needed
            // });

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const pdfBytes = await pdfDoc.save();

            // Trigger the download
            await downloadPdf(pdfBytes, `${template?.name || 'flow'}_protected.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <Panel position="top-right">
            <button
                className="download-btn xy-theme__button"
                onClick={onClick}
                style={{
                    padding: "8px 16px",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    border: "none",
                    borderRadius: theme.shape.borderRadius,
                    cursor: "pointer",
                }}
            >
                Download Protected PDF
            </button>
        </Panel>
    );
}

export default DownloadPdf;