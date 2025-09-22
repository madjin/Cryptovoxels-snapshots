import { ExtensionProperty } from '@gltf-transform/core';
import { KHR_MATERIALS_VARIANTS } from '../constants.js';
/**
 * Defines a variant of a {@link Material}. See {@link KHRMaterialsVariants}.
 */
export declare class Variant extends ExtensionProperty {
    static EXTENSION_NAME: string;
    extensionName: typeof KHR_MATERIALS_VARIANTS;
    propertyType: 'Variant';
    parentTypes: ['MappingList'];
    protected init(): void;
}
