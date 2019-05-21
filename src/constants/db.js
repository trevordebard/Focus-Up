// Setup the DB
import FileSync from 'lowdb/adapters/FileSync';

const { remote } = require('electron');

const { app } = remote;

const path = require('path');

const dbPath = path.join(app.getPath('userData'), 'db.json');
const adapter = new FileSync(dbPath);
const db = require('lowdb')(adapter);

db.defaults({ blockedSites: [] }).write();

export default db;
