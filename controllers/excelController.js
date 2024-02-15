import excelModel from "../models/excelModel.js";


class ExcelController {
    static async exportToExcel(req, res) {
        try {
            const data = [
                { Name: 'John', Age: 25, Country: 'USA' },
                { Name: 'Alice', Age: 30, Country: 'Canada' },
            ];

            const buffer = await excelModel.exportToExcel(data);

            res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async importFromExcel(req, res) {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const data = await ExcelModel.importFromExcel(file);
            res.json({ data });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default ExcelController;
