const fs = require('fs');
const path = require('path');

module.exports.createStudent = fs.readFileSync(path.join(__dirname, 'createStudent.gql'), 'utf8');
module.exports.createTemplate = fs.readFileSync(path.join(__dirname, 'createTemplate.gql'), 'utf8');
module.exports.createTemplateCategory = fs.readFileSync(path.join(__dirname, 'createTemplateCategory.gql'), 'utf8');
module.exports.deleteStudent = fs.readFileSync(path.join(__dirname, 'deleteStudent.gql'), 'utf8');
module.exports.deleteTemplate = fs.readFileSync(path.join(__dirname, 'deleteTemplate.gql'), 'utf8');
module.exports.deleteTemplateCategory = fs.readFileSync(path.join(__dirname, 'deleteTemplateCategory.gql'), 'utf8');
module.exports.login = fs.readFileSync(path.join(__dirname, 'login.gql'), 'utf8');
module.exports.logout = fs.readFileSync(path.join(__dirname, 'logout.gql'), 'utf8');
module.exports.register = fs.readFileSync(path.join(__dirname, 'register.gql'), 'utf8');
module.exports.suspendTemplate = fs.readFileSync(path.join(__dirname, 'suspendTemplate.gql'), 'utf8');
module.exports.unsuspendTemplate = fs.readFileSync(path.join(__dirname, 'unsuspendTemplate.gql'), 'utf8');
module.exports.updateStudent = fs.readFileSync(path.join(__dirname, 'updateStudent.gql'), 'utf8');
module.exports.updateTemplate = fs.readFileSync(path.join(__dirname, 'updateTemplate.gql'), 'utf8');
module.exports.updateTemplateCategory = fs.readFileSync(path.join(__dirname, 'updateTemplateCategory.gql'), 'utf8');
