import mitt from 'mitt';

const ContentType = { 
    TEXT : "Text",
    NUMBER : "Number",
    JSON : "JSON"
}

const AppEvents = mitt();

export { ContentType, AppEvents };