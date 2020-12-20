const express = require('express');
const router = express.Router();
const mysqlPool = require('../config/db.config');

router.get('/', (req, res, next) => {
    let context = { title: 'Portfolio' }

    getProjects()
        .then(projects => {
            let proj = projects.map(obj => {
                return ({
                    name: obj.name,
                    note: obj.note || '',
                    desc: obj.description,
                    url: obj.links ? obj.links.split(/[^a-zA-Z1-9\-:\/.]/).filter(i => i !== 'null' ? i : '') : '',
                    img: obj.images ? obj.images.split(/[^a-zA-Z1-9\-.]/).filter(i => i !== 'null' ? i : '') : '',
                    tech: obj.tech ? obj.tech.split(/[^a-zA-Z1-9().]/).filter(i => i !== 'null' ? i : '') : ''
                });
            });

            context.projects = proj;
            context.page = 'portfolio';

            res.render('portfolio', context);
        })
        .catch((err) => {
            return res.status(400).json({ errors: err });
        });
});

function getProjects() {
    /* Queries the local database for information on portfolio projects */
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT t1.name, t1.note, t1.description, t1.links, t2.tech, t3.images' +
            ' FROM' +
            ' (SELECT p.project_id, name, note, description, JSON_ARRAYAGG(url) AS links' +
            ' FROM projects AS p' +
            ' LEFT JOIN (project_links as l)' +
            ' ON (p.project_id=l.project_id)' +
            ' GROUP BY p.project_id) AS t1' +
            ' LEFT JOIN (' +
            ' (SELECT p_t.project_id, JSON_ARRAYAGG(t.name) AS tech' +
            ' FROM technologies AS t' +
            ' RIGHT JOIN (project_technologies AS p_t)' +
            ' ON (p_t.technology_id=t.technology_id)' +
            ' GROUP BY project_id) AS t2,' +
            ' (SELECT p.project_id, JSON_ARRAYAGG(url) AS images' +
            ' FROM projects AS p' +
            ' LEFT JOIN (images AS i)' +
            ' ON (p.project_id=i.project_id)' +
            ' GROUP BY p.project_id) AS t3)' +
            ' ON (t1.project_id=t2.project_id' +
            ' AND t1.project_id=t3.project_id)' +
            ' ORDER BY t1.project_id DESC;',
            (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result);
            }
        )
    });
}

module.exports = router;