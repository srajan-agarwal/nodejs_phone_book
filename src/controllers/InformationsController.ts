import { Information } from "../database/models/Information";

class InformationsController {

    // Get api to fetch all informations 
    public async get(req: any, res: any) {
        try {
            const results = await Information.findAll();
            res.send({
                status: 200,
                message: "Contacts fetched succcessfully!",
                data: results
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }

    // Post api to insert a record of one information
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

            const data = await Information.create({
                name, email, phone_no, work, company, location
            });

            res.send({
                status: 200,
                message: "Contact inserted succcessfully!",
                data: data,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }

    // Update api to update a record of information by id
    public async update(req: any, res: any) {
        try {
            const id = +req.params.id;

            const record = await Information.findOne({
                where: { id: id },
            });

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

            await Information.update(
                { name, email, phone_no, work, company, location },
                { where: { id: id } }
            );

            res.send({
                status: 200,
                message: "Contact updated succcessfully!",
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }

    // Delete api to delete a record of information by id
    public async delete(req: any, res: any) {
        try {
            const id = +req.params.id;

            const record = await Information.findOne({
                where: { id: id },
            });

            if (!record) {
                return res.status(404).send({
                    status: 404,
                    message: "Contact not found",
                });
            }

            await Information.destroy({
                where: { id: id },
            });

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