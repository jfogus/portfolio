const mysqlPool = require('../config/db.config');

class Project {
    constructor(name, note, description, links, images, technologies) {
        this.name = name;
        this.note = note;
        this.description = description;
        this.links = links;
        this.images = images;
        this.technologies = technologies;
    }

    static fromReqBody(reqBody) {
        return new Project(
            reqBody.name,
            reqBody.note,
            reqBody.description,
            reqBody.links,
            reqBody.images,
            reqBody.technologies
        );
    }

    static fromProjectDbDto(projectDbDto) {
        return new Project(
            projectDbDto.name,
            projectDbDto.note,
            projectDbDto.descr,
            JSON.parse(projectDbDto.links),
            JSON.parse(projectDbDto.img),
            JSON.parse(projectDbDto.tech),
        );
    }
}

Project.fetchAll = result => {
    const query = 'SELECT p.name, p.note, p.description AS descr, t1.links, t2.tech, t3.img'+
        ' FROM' +
        ' projects AS p' +
        ' LEFT JOIN (' +
        ' (SELECT l.project_id, JSON_ARRAYAGG(url) AS links' +
        ' FROM projects AS p' +
        ' LEFT JOIN (project_links AS l)' +
        ' ON (p.project_id=l.project_id)' +
        ' WHERE l.project_id IS NOT NULL' +
        ' GROUP BY p.project_id' +
        ' )) AS t1' +
        ' ON (p.project_id=t1.project_id)' +
        ' LEFT JOIN (' +
        ' (SELECT p_t.project_id, JSON_ARRAYAGG(t.name) AS tech' +
        ' FROM technologies AS t' +
        ' RIGHT JOIN (project_technologies AS p_t)' +
        ' ON (p_t.technology_id=t.technology_id)' +
        ' GROUP BY project_id' +
        ' )) AS t2' +
        ' ON (p.project_id=t2.project_id)' +
        ' LEFT JOIN (' +
        ' (SELECT p.project_id, JSON_ARRAYAGG(url) AS img' +
        ' FROM projects AS p' +
        ' LEFT JOIN (images AS i)' +
        ' ON (p.project_id=i.project_id)' +
        ' WHERE i.project_id IS NOT NULL' +
        ' GROUP BY p.project_id' +
        ' )) AS t3' +
        ' ON (p.project_id=t3.project_id)' +
        ' ORDER BY p.project_id DESC;';

    mysqlPool.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        const projectArray = res.map(projectDbDto => Project.fromProjectDbDto(projectDbDto));
        result(null, projectArray);
    });
}

module.exports = Project;