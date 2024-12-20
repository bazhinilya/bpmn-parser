const regexId = /id="([^"]+)"/;
const regexName = /name="([^"]+)"/;
const regexClass = /camunda:class="([^"]+)"/;
const regexInputOuput = /<camunda:inputOutput>[\s\S]*?<\/camunda:inputOutput>/gi;
const regexInputParam = /<camunda:inputParameter name="([^"]+)"[^>]*>(.*?)<\/camunda:inputParameter>/gs;
const regexOutputParam = /<camunda:outputParameter name="([^"]+)"[^>]*>(.*?)<\/camunda:outputParameter>/gs;
const regexMapEntry = /<camunda:entry key="([^"]+)"[^>]*>(.*?)<\/camunda:entry>/gs;
const regexInterpolation = /[\$\{\}]/g

export const getId = (strMatch) => strMatch.match(regexId)[1];
export const getName = (strMatch) => strMatch.match(regexName)[1];
export const getNames = (strMatch) => strMatch.match(regexName);
export const getClass = (strMatch) => strMatch.match(regexClass)[1];

export const getInputOutput = (strMatch) => {
    const inputOutputMatch = strMatch.match(regexInputOuput)[0];
    return {
        inputs: findAttr(inputOutputMatch, regexInputParam),
        outputs: findAttr(inputOutputMatch, regexOutputParam),
        mapEntry: findAttr(inputOutputMatch, regexMapEntry)
    };
}

function findAttr(inputOutputMatch, regex) {
    const variables = [];
    let match;
    while ((match = regex.exec(inputOutputMatch)) !== null) {
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        variables.push({ name: match[1], value: match[2].trim().replace(regexInterpolation, '') });
    }
    return variables;
}
