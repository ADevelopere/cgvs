import { EditableColumn } from "@/types/table.type";
import { faker } from "@faker-js/faker";

// Types for mock data generation
export interface MockDataConfig {
    rowCount?: number;
    columns: EditableColumn[];
    seed?: number;
}

export interface MockDataItem {
    id: number;
    [key: string]: unknown;
}

// Utility to generate mock data based on column type
const generateValueForColumn = (
    column: EditableColumn,
    rowIndex: number,
): unknown => {
    const { type, options } = column;

    switch (type) {
        case "text":
            return faker.person.fullName();

        case "number":
            return faker.number.int({ min: 1, max: 1000 });

        case "date":
            return faker.date.past({ years: 5 }).toISOString().split("T")[0];

        case "boolean":
            return faker.datatype.boolean();

        case "select":
            if (options && options.length > 0) {
                return faker.helpers.arrayElement(options).value;
            }
            return faker.helpers.arrayElement([
                "Option A",
                "Option B",
                "Option C",
            ]);

        case "country":
            return faker.location.country();

        case "phone":
            return faker.phone.number();

        case "custom":
            return `Custom Value ${rowIndex + 1}`;

        default:
            return `Value ${rowIndex + 1}`;
    }
};

// Generate mock data for table
export const generateMockData = (config: MockDataConfig): MockDataItem[] => {
    const { rowCount = 100, columns, seed = 12345 } = config;

    // Set seed for consistent data generation
    faker.seed(seed);

    const data: MockDataItem[] = [];

    for (let i = 0; i < rowCount; i++) {
        const row: MockDataItem = {
            id: i + 1,
        };

        columns.forEach((column) => {
            const accessor =
                typeof column.accessor === "string"
                    ? column.accessor
                    : column.id;
            row[accessor] = generateValueForColumn(column, i);
        });

        data.push(row);
    }

    return data;
};

// Predefined column configurations for different scenarios
export const createPersonColumns = (): EditableColumn[] => [
    {
        id: "firstName",
        type: "text",
        label: "First Name",
        accessor: "firstName",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 80,
    },
    {
        id: "lastName",
        type: "text",
        label: "Last Name",
        accessor: "lastName",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 80,
    },
    {
        id: "email",
        type: "text",
        label: "Email",
        accessor: "email",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 200,
        minWidth: 150,
    },
    {
        id: "age",
        type: "number",
        label: "Age",
        accessor: "age",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 80,
        minWidth: 60,
    },
    {
        id: "birthDate",
        type: "date",
        label: "Birth Date",
        accessor: "birthDate",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 100,
    },
    {
        id: "country",
        type: "country",
        label: "Country",
        accessor: "country",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 140,
        minWidth: 100,
    },
    {
        id: "active",
        type: "boolean",
        label: "Active",
        accessor: "active",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 80,
        minWidth: 60,
    },
];

export const createProductColumns = (): EditableColumn[] => [
    {
        id: "name",
        type: "text",
        label: "Product Name",
        accessor: "name",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 180,
        minWidth: 120,
    },
    {
        id: "category",
        type: "select",
        label: "Category",
        accessor: "category",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 100,
        options: [
            { label: "Electronics", value: "electronics" },
            { label: "Clothing", value: "clothing" },
            { label: "Books", value: "books" },
            { label: "Home & Garden", value: "home_garden" },
            { label: "Sports", value: "sports" },
        ],
    },
    {
        id: "price",
        type: "number",
        label: "Price ($)",
        accessor: "price",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 100,
        minWidth: 80,
    },
    {
        id: "stock",
        type: "number",
        label: "Stock",
        accessor: "stock",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 80,
        minWidth: 60,
    },
    {
        id: "released",
        type: "date",
        label: "Release Date",
        accessor: "released",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 100,
    },
    {
        id: "available",
        type: "boolean",
        label: "Available",
        accessor: "available",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 90,
        minWidth: 70,
    },
];

export const createOrderColumns = (): EditableColumn[] => [
    {
        id: "orderNumber",
        type: "text",
        label: "Order #",
        accessor: "orderNumber",
        sortable: true,
        filterable: true,
        initialWidth: 120,
        minWidth: 100,
    },
    {
        id: "customerName",
        type: "text",
        label: "Customer",
        accessor: "customerName",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 150,
        minWidth: 120,
    },
    {
        id: "total",
        type: "number",
        label: "Total ($)",
        accessor: "total",
        sortable: true,
        filterable: true,
        initialWidth: 100,
        minWidth: 80,
    },
    {
        id: "status",
        type: "select",
        label: "Status",
        accessor: "status",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 100,
        options: [
            { label: "Pending", value: "pending" },
            { label: "Processing", value: "processing" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
        ],
    },
    {
        id: "orderDate",
        type: "date",
        label: "Order Date",
        accessor: "orderDate",
        sortable: true,
        filterable: true,
        initialWidth: 120,
        minWidth: 100,
    },
    {
        id: "phone",
        type: "phone",
        label: "Contact",
        accessor: "phone",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 140,
        minWidth: 120,
    },
];

// Generate specific mock data types
export const generatePersonData = (rowCount = 100): MockDataItem[] => {
    faker.seed(12345);

    return Array.from({ length: rowCount }, (_, i) => ({
        id: i + 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 80 }),
        birthDate: faker.date.birthdate().toISOString().split("T")[0],
        country: faker.location.country(),
        active: faker.datatype.boolean(),
    }));
};

export const generateProductData = (rowCount = 100): MockDataItem[] => {
    faker.seed(12345);

    const categories = [
        "electronics",
        "clothing",
        "books",
        "home_garden",
        "sports",
    ];

    return Array.from({ length: rowCount }, (_, i) => ({
        id: i + 1,
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        price: Number(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        stock: faker.number.int({ min: 0, max: 500 }),
        released: faker.date.past({ years: 2 }).toISOString().split("T")[0],
        available: faker.datatype.boolean(),
    }));
};

export const generateOrderData = (rowCount = 100): MockDataItem[] => {
    faker.seed(12345);

    const statuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];

    return Array.from({ length: rowCount }, (_, i) => ({
        id: i + 1,
        orderNumber: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
        customerName: faker.person.fullName(),
        total: Number(faker.commerce.price({ min: 20, max: 2000, dec: 2 })),
        status: faker.helpers.arrayElement(statuses),
        orderDate: faker.date.recent({ days: 90 }).toISOString().split("T")[0],
        phone: faker.phone.number(),
    }));
};

// Utility to create a mix of column types for testing
export const createMixedColumns = (): EditableColumn[] => [
    {
        id: "id",
        type: "number",
        label: "ID",
        accessor: "id",
        sortable: true,
        filterable: true,
        initialWidth: 70,
        minWidth: 50,
    },
    {
        id: "text",
        type: "text",
        label: "Text Field",
        accessor: "text",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 150,
        minWidth: 100,
    },
    {
        id: "number",
        type: "number",
        label: "Number Field",
        accessor: "number",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 80,
    },
    {
        id: "date",
        type: "date",
        label: "Date Field",
        accessor: "date",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 100,
    },
    {
        id: "boolean",
        type: "boolean",
        label: "Boolean Field",
        accessor: "boolean",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 120,
        minWidth: 80,
    },
    {
        id: "select",
        type: "select",
        label: "Select Field",
        accessor: "select",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 130,
        minWidth: 100,
        options: [
            { label: "Option 1", value: "opt1" },
            { label: "Option 2", value: "opt2" },
            { label: "Option 3", value: "opt3" },
        ],
    },
    {
        id: "country",
        type: "country",
        label: "Country Field",
        accessor: "country",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 140,
        minWidth: 100,
    },
    {
        id: "phone",
        type: "phone",
        label: "Phone Field",
        accessor: "phone",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 140,
        minWidth: 120,
    },
];

export const generateMixedData = (rowCount = 100): MockDataItem[] => {
    faker.seed(12345);

    const selectOptions = ["opt1", "opt2", "opt3"];

    return Array.from({ length: rowCount }, (_, i) => ({
        id: i + 1,
        text: faker.company.name(),
        number: faker.number.int({ min: 1, max: 1000 }),
        date: faker.date.past({ years: 3 }).toISOString().split("T")[0],
        boolean: faker.datatype.boolean(),
        select: faker.helpers.arrayElement(selectOptions),
        country: faker.location.country(),
        phone: faker.phone.number(),
    }));
};
