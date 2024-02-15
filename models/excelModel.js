import ExcelJS from 'exceljs';

class excelModel {
    static async exportToExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Add data
        data.forEach((item) => {
        const row = [];
        headers.forEach((header) => {
            row.push(item[header]);
        });
        worksheet.addRow(row);
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    static async importFromExcel(file) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);

        const worksheet = workbook.worksheets[0];
        const headers = worksheet.getRow(1).values;

        const data = [];
        for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i).values;
        const rowData = {};
        headers.forEach((header, index) => {
            rowData[header] = row[index];
        });
        data.push(rowData);
        }

        return data;
    }
}

export default excelModel;
