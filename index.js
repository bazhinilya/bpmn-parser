import 'dotenv/config.js'

import fs from 'fs';
import { getClass, getId, getInputOutput, getName } from './src/utils.js';

const xmlOriginal = fs.readFileSync(process.env.BPMN_FILE, 'utf8');

const regexServiceTask = /<bpmn:serviceTask[\s\S]*?<\/bpmn:serviceTask>/gi;
const serviceTasksMatch = xmlOriginal.match(regexServiceTask);

const sts = [];
for (const serviceTask of serviceTasksMatch) {
    sts.push({
        idMatch: getId(serviceTask),
        nameMatch: getName(serviceTask),
        classMatch: getClass(serviceTask),
        inputOutputMatch: getInputOutput(serviceTask)
    });
}
console.log(sts);