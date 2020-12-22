const projectController = require('../controllers/project.controller');

module.exports = app => {
    app.get('/portfolio', projectController.findAll);
}