import 'dotenv/config.js'

import fs from 'fs';
import { getClass, getId, getIncoming, getInputOutput, getName, getOutgoing } from './src/utils.js';

const xmlOriginal = fs.readFileSync(process.env.BPMN_FILE, 'utf8');

const serviceTaskRegex = /<bpmn:serviceTask[\s\S]*?<\/bpmn:serviceTask>/gi;
const scriptTaskRegex = /<bpmn:scriptTask[\s\S]*?<\/bpmn:scriptTask>/gi;
const userTaskRegex = /<bpmn:userTask[\s\S]*?<\/bpmn:userTask>/gi;

const serviceTasksMatch = xmlOriginal.match(serviceTaskRegex);
const scriptTasksMatch = xmlOriginal.match(scriptTaskRegex);
const userTasksMatch = xmlOriginal.match(userTaskRegex);

const sts = [];
for (const serviceTask of serviceTasksMatch) {
    sts.push({
        idMatch: getId(serviceTask),
        nameMatch: getName(serviceTask),
        classMatch: getClass(serviceTask),
        inputOutputMatch: getInputOutput(serviceTask),
        incomingMatch: getIncoming(serviceTask),
        outgoingMatch: getOutgoing(serviceTask),
    });
}
console.log(sts);