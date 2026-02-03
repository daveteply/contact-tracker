export const spaceDelimitCamelCase = (camelCaseString?: string): string => 
    (camelCaseString ? camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2') : '');