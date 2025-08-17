const fs = require('fs');
const path = require('path');

module.exports.isAuthenticated = fs.readFileSync(path.join(__dirname, 'isAuthenticated.gql'), 'utf8');
module.exports.mainTemplateCategory = fs.readFileSync(path.join(__dirname, 'mainTemplateCategory.gql'), 'utf8');
module.exports.me = fs.readFileSync(path.join(__dirname, 'me.gql'), 'utf8');
module.exports.student = fs.readFileSync(path.join(__dirname, 'student.gql'), 'utf8');
module.exports.students = fs.readFileSync(path.join(__dirname, 'students.gql'), 'utf8');
module.exports.suspensionTemplateCategory = fs.readFileSync(path.join(__dirname, 'suspensionTemplateCategory.gql'), 'utf8');
module.exports.template = fs.readFileSync(path.join(__dirname, 'template.gql'), 'utf8');
module.exports.templateCategories = fs.readFileSync(path.join(__dirname, 'templateCategories.gql'), 'utf8');
module.exports.templateCategory = fs.readFileSync(path.join(__dirname, 'templateCategory.gql'), 'utf8');
module.exports.templateConfig = fs.readFileSync(path.join(__dirname, 'templateConfig.gql'), 'utf8');
module.exports.templates = fs.readFileSync(path.join(__dirname, 'templates.gql'), 'utf8');
module.exports.user = fs.readFileSync(path.join(__dirname, 'user.gql'), 'utf8');
module.exports.users = fs.readFileSync(path.join(__dirname, 'users.gql'), 'utf8');
