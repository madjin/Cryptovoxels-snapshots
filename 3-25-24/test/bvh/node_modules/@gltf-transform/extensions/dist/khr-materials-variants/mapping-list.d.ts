import { ExtensionProperty, IProperty, Nullable, PropertyType } from '@gltf-transform/core';
import { KHR_MATERIALS_VARIANTS } from '../constants.js';
import type { Mapping } from './mapping.js';
interface IMappingList extends IProperty {
    mappings: Mapping[];
}
/**
 * List of material variant {@link Mapping}s. See {@link KHRMaterialsVariants}.
 */
export declare class MappingList extends ExtensionProperty<IMappingList> {
    static EXTENSION_NAME: string;
    extensionName: typeof KHR_MATERIALS_VARIANTS;
    propertyType: 'MappingList';
    parentTypes: [PropertyType.PRIMITIVE];
    protected init(): void;
    protected getDefaults(): Nullable<IMappingList>;
    /** Adds a {@link Mapping} to this mapping. */
    addMapping(mapping: Mapping): this;
    /** Removes a {@link Mapping} from the list for this {@link Primitive}. */
    removeMapping(mapping: Mapping): this;
    /** Lists {@link Mapping}s in this {@link Primitive}. */
    listMappings(): Mapping[];
}
export {};
