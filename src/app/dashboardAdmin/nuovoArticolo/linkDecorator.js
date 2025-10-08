import { CompositeDecorator } from 'draft-js';

//Questo codice serve per dare lo stile al link all'interno del editor Draft.js

// Funzione per trovare le entità di tipo LINK
export const findLinkEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
};

// Componente per il rendering del link
export const Link = (props) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    return (
        <a href={url}>
            {props.children}
        </a>
    );
};

// Decorator per i link
const linkDecorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link,
    },
]);

export default linkDecorator;
