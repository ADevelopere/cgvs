const fs = require('fs');
const path = require('path');

module.exports.createTemplate = fs.readFileSync(path.join(__dirname, 'createTemplate.gql'), 'utf8');
module.exports.createTemplateCategory = fs.readFileSync(path.join(__dirname, 'createTemplateCategory.gql'), 'utf8');
module.exports.login = fs.readFileSync(path.join(__dirname, 'login.gql'), 'utf8');
module.exports.logout = fs.readFileSync(path.join(__dirname, 'logout.gql'), 'utf8');
module.exports.register = fs.readFileSync(path.join(__dirname, 'register.gql'), 'utf8');
