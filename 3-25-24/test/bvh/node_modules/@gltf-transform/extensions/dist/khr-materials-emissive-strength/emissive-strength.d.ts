import { ExtensionProperty, IProperty, Nullable, PropertyType } from '@gltf-transform/core';
import { KHR_MATERIALS_EMISSIVE_STRENGTH } from '../constants.js';
interface IEmissiveStrength extends IProperty {
    emissiveStrength: number;
}
/**
 * Defines emissive strength for a PBR {@link Material}, allowing high-dynamic-range
 * (HDR) emissive materials. See {@link KHRMaterialsEmissiveStrength}.
 */
export declare class EmissiveStrength extends ExtensionProperty<IEmissiveStrength> {
    static EXTENSION_NAME: string;
    extensionName: typeof KHR_MATERIALS_EMISSIVE_STRENGTH;
    propertyType: 'EmissiveStrength';
    parentTypes: [PropertyType.MATERIAL];
    protected init(): void;
    protected getDefaults(): Nullable<IEmissiveStrength>;
    /**********************************************************************************************
     * EmissiveStrength.
     */
    /** EmissiveStrength. */
    getEmissiveStrength(): number;
    /** EmissiveStrength. */
    setEmissiveStrength(strength: number): this;
}
export {};
