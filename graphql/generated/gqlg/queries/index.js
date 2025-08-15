const fs = require('fs');
const path = require('path');

module.exports.isAuthenticated = fs.readFileSync(path.join(__dirname, 'isAuthenticated.gql'), 'utf8');
module.exports.me = fs.readFileSync(path.join(__dirname, 'me.gql'), 'utf8');
module.exports.paginatedTemplates = fs.readFileSync(path.join(__dirname, 'paginatedTemplates.gql'), 'utf8');
module.exports.template = fs.readFileSync(path.join(__dirname, 'template.gql'), 'utf8');
module.exports.templateConfig = fs.readFileSync(path.join(__dirname, 'templateConfig.gql'), 'utf8');
module.exports.templates = fs.readFileSync(path.join(__dirname, 'templates.gql'), 'utf8');
module.exports.user = fs.readFileSync(path.join(__dirname, 'user.gql'), 'utf8');
module.exports.users = fs.readFileSync(path.join(__dirname, 'users.gql'), 'utf8');
