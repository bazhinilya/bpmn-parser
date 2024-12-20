const idRegex = /id="([^"]+)"/;
const nameRegex = /name="([^"]+)"/;
const classRegex = /camunda:class="([^"]+)"/;
const inputOuputRegex = /<camunda:inputOutput>[\s\S]*?<\/camunda:inputOutput>/gi;
const incomingRegex = /<bpmn:incoming>[\s\S]*?<\/bpmn:incoming>/gi;
const outgoingRegex = /<bpmn:outgoing>[\s\S]*?<\/bpmn:outgoing>/gi;

const inputParamRegex = /<camunda:inputParameter name="([^"]+)"[^>]*>(.*?)<\/camunda:inputParameter>/gs;
const outputParamRegex = /<camunda:outputParameter name="([^"]+)"[^>]*>(.*?)<\/camunda:outputParameter>/gs;
const mapEntriesRegex = /<camunda:entry key="([^"]+)">([^<]+)<\/camunda:entry>/g;
const scriptRegex = /<camunda:script[^>]*>([^<]+)<\/camunda:script>/;

export const getId = (strMatch) => strMatch.match(idRegex)[1];
export const getName = (strMatch) => strMatch.match(nameRegex)[1];
export const getClass = (strMatch) => strMatch.match(classRegex)[1];
export const getIncoming = (strMatch) => strMatch.match(incomingRegex).map(item => item.replace(/<\/?bpmn:incoming>/g, ''));
export const getOutgoing = (strMatch) => strMatch.match(outgoingRegex).map(item => item.replace(/<\/?bpmn:outgoing>/g, ''))

export function getInputOutput(strMatch) {
    const inputOutputMatch = strMatch.match(inputOuputRegex)[0];
    return {
        inputs: parseInputOutput(inputOutputMatch, inputParamRegex),
        outputs: parseInputOutput(inputOutputMatch, outputParamRegex),
    };
}

function parseInputOutput(inputOutputMatch, regex) {
    const taskVariables = [];

    let match;
    while ((match = regex.exec(inputOutputMatch)) !== null) {
        const key = match[1];
        let value = match[2].trim();

        if (value.startsWith('<camunda:map>')) {
            const mapValue = {};
            let mapEntry;
            while ((mapEntry = mapEntriesRegex.exec(value)) !== null) {
                mapValue[mapEntry[1]] = mapEntry[2];
            }
            value = mapValue;
        } else if (value.startsWith('<camunda:script')) {
            const scriptContent = value.match(scriptRegex);
            value = { script: scriptContent[1] };
        }
        taskVariables.push({ key, value });
    }
    return taskVariables;
}