const projectModel = require('../models/project.model')

module.exports.findAll = (req, res) => {
    projectModel.fetchAll((err, data) => {
        if (err) {
            return res.status(500).json({ err: err });
        }

        const context = {
            title: 'Portfolio',
            projects: data
        }

        res.status(200).render('portfolio', context);
    });
};