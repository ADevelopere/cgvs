import { STATUS_OPTIONS } from "../constants/tableConstants"

/**
 * Generates a large dataset for testing table functionality
 * @param count Number of rows to generate
 * @returns Array of data rows
 */
export const generateDemoData = (count: number) => {
  const data = []

  for (let i = 1; i <= count; i++) {
    const randomDay = Math.floor(Math.random() * 28) + 1
    const randomMonth = Math.floor(Math.random() * 12) + 1
    const randomYear = 2020 + Math.floor(Math.random() * 4)

    data.push({
      id: i,
      name: `User ${i}`,
      date: `${randomYear}-${randomMonth.toString().padStart(2, "0")}-${randomDay.toString().padStart(2, "0")}`,
      email: `user${i}@example.com`,
      status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)],
    })
  }

  return data
}
