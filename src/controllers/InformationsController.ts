import pool from '../dbconfig/dbconnector';

class InformationsController {

    public async get(req: any, res: any) {
        try {
            const client = await pool.connect();

            const sql = "SELECT * FROM informations";
            const { rows } = await client.query(sql);
            const contacts = rows;

            client.release();

            res.send({
                status: 200,
                message: "Contacts fetched succcessfully!",
                data: contacts
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async add(req: any, res: any) {
        try {
            const name = req.body.name;
            const email = req.body.email;
            const phone_no = req.body.phone_no;
            const work = req.body.work;
            const company = req.body.company;
            const location = req.body.location;

            if (!name || !email || !phone_no || !work || !company || !location) {
                return res.status(400).send({
                    status: 400,
                    message: "Parameter missing",
                });
            }

            const client = await pool.connect();

            const sql = `INSERT INTO informations (name, email, phone_no, work, company, location) VALUES 
            ('${name}', '${email}', '${phone_no}', '${work}', '${company}', '${location}')`;
            await client.query(sql);

            client.release();

            res.send({
                status: 200,
                message: "Contact inserted succcessfully!",
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }
    public async update(req: any, res: any) {
        try {
            const id = +req.params.id;

            const client = await pool.connect();

            const findOneSql = `SELECT * FROM informations WHERE id = ${id}`;
            const { rows } = await client.query(findOneSql);

            const record = rows[0];

            if (!record) {
                return res.status(404).send({
                    status: 404,
                    message: "Contact not found",
                });
            }

            const name = req.body.name || record.name;
            const email = req.body.email || record.email;
            const phone_no = req.body.phone_no || record.phone_no;
            const work = req.body.work || record.work;
            const company = req.body.company || record.company;
            const location = req.body.location || record.location;

            const sql = `UPDATE informations SET name = '${name}', email = '${email}',  phone_no = '${phone_no}',  work = '${work}', 
            company = '${company}',  location = '${location}' WHERE id = ${id};`
            await client.query(sql);

            client.release();

            res.send({
                status: 200,
                message: "Contact updated succcessfully!",
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }
    public async delete(req: any, res: any) {
        try {
            const id = req.params.id;
            const client = await pool.connect();

            const findOneSql = `SELECT * FROM informations WHERE id = ${id}`;
            const { rows } = await client.query(findOneSql);

            const record = rows[0];

            if (!record) {
                return res.status(404).send({
                    status: 404,
                    message: "Contact not found",
                });
            }

            const sql = `DELETE FROM informations WHERE id = ${id}`;
            await client.query(sql);

            client.release();

            res.send({
                status: 200,
                message: "Contact deleted succcessfully!",
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default InformationsController;