import { Nullable, PropertyType, ExtensionProperty, IProperty } from '@gltf-transform/core';
import { KHR_XMP_JSON_LD } from '../constants.js';
type Term = string;
type TermDefinition = string | Record<string, string>;
type Value = string | number | boolean;
declare const PARENT_TYPES: PropertyType[];
interface IPacket extends IProperty {
    context: Record<Term, TermDefinition>;
    properties: Record<string, Value | Record<string, unknown>>;
}
/**
 * Defines an XMP packet associated with a Document or Property. See {@link KHRXMP}.
 */
export declare class Packet extends ExtensionProperty<IPacket> {
    propertyType: 'Packet';
    parentTypes: typeof PARENT_TYPES;
    extensionName: typeof KHR_XMP_JSON_LD;
    static EXTENSION_NAME: string;
    protected init(): void;
    protected getDefaults(): Nullable<IPacket>;
    /**********************************************************************************************
     * Context.
     */
    /**
     * Returns the XMP context definition URL for the given term.
     * See: https://json-ld.org/spec/latest/json-ld/#the-context
     * @param term Case-sensitive term. Usually a concise, lowercase, alphanumeric identifier.
     */
    getContext(): Record<Term, TermDefinition>;
    /**
     * Sets the XMP context definition URL for the given term.
     * See: https://json-ld.org/spec/latest/json-ld/#the-context
     *
     * Example:
     *
     * ```typescript
     * packet.setContext({
     *   dc: 'http://purl.org/dc/elements/1.1/',
     *   model3d: 'https://schema.khronos.org/model3d/xsd/1.0/',
     * });
     * ```
     *
     * @param term Case-sensitive term. Usually a concise, lowercase, alphanumeric identifier.
     * @param definition URI for XMP namespace.
     */
    setContext(context: Record<Term, TermDefinition>): this;
    /**********************************************************************************************
     * Properties.
     */
    /**
     * Lists properties defined in this packet.
     *
     * Example:
     *
     * ```typescript
     * packet.listProperties(); // → ['dc:Language', 'dc:Creator', 'xmp:CreateDate']
     * ```
     */
    listProperties(): string[];
    /**
     * Returns the value of a property, as a literal or JSONLD object.
     *
     * Example:
     *
     * ```typescript
     * packet.getProperty('dc:Creator'); // → {"@list": ["Acme, Inc."]}
     * packet.getProperty('dc:Title'); // → {"@type": "rdf:Alt", "rdf:_1": {"@language": "en-US", "@value": "Lamp"}}
     * packet.getProperty('xmp:CreateDate'); // → "2022-01-01"
     * ```
     */
    getProperty(name: string): Value | Record<string, unknown> | null;
    /**
     * Sets the value of a property, as a literal or JSONLD object.
     *
     * Example:
     *
     * ```typescript
     * packet.setProperty('dc:Creator', {'@list': ['Acme, Inc.']});
     * packet.setProperty('dc:Title', {
     * 	'@type': 'rdf:Alt',
     * 	'rdf:_1': {'@language': 'en-US', '@value': 'Lamp'}
     * });
     * packet.setProperty('model3d:preferredSurfaces', {'@list': ['vertical']});
     * ```
     */
    setProperty(name: string, value: Value | Record<string, unknown>): this;
    /**********************************************************************************************
     * Serialize / Deserialize.
     */
    /**
     * Serializes the packet context and properties to a JSONLD object.
     */
    toJSONLD(): Record<string, unknown>;
    /**
     * Deserializes a JSONLD packet, then overwrites existing context and properties with
     * the new values.
     */
    fromJSONLD(jsonld: Record<string, unknown>): this;
    /**********************************************************************************************
     * Validation.
     */
    /** @hidden */
    private _assertContext;
}
export {};
