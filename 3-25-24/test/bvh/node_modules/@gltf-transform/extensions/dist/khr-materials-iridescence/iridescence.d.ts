import { ExtensionProperty, IProperty, Nullable, PropertyType, Texture, TextureInfo } from '@gltf-transform/core';
import { KHR_MATERIALS_IRIDESCENCE } from '../constants.js';
interface IIridescence extends IProperty {
    iridescenceFactor: number;
    iridescenceTexture: Texture;
    iridescenceTextureInfo: TextureInfo;
    iridescenceIOR: number;
    iridescenceThicknessMinimum: number;
    iridescenceThicknessMaximum: number;
    iridescenceThicknessTexture: Texture;
    iridescenceThicknessTextureInfo: TextureInfo;
}
/**
 * Defines iridescence (thin film interference) on a PBR {@link Material}. See {@link KHRMaterialsIridescence}.
 */
export declare class Iridescence extends ExtensionProperty<IIridescence> {
    static EXTENSION_NAME: string;
    extensionName: typeof KHR_MATERIALS_IRIDESCENCE;
    propertyType: 'Iridescence';
    parentTypes: [PropertyType.MATERIAL];
    protected init(): void;
    protected getDefaults(): Nullable<IIridescence>;
    /**********************************************************************************************
     * Iridescence.
     */
    /** Iridescence; linear multiplier. See {@link Iridescence.getIridescenceTexture getIridescenceTexture}. */
    getIridescenceFactor(): number;
    /** Iridescence; linear multiplier. See {@link Iridescence.getIridescenceTexture getIridescenceTexture}. */
    setIridescenceFactor(factor: number): this;
    /**
     * Iridescence intensity.
     *
     * Only the red (R) channel is used for iridescence intensity, but this texture may optionally
     * be packed with additional data in the other channels.
     */
    getIridescenceTexture(): Texture | null;
    /**
     * Settings affecting the material's use of its iridescence texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getIridescenceTextureInfo(): TextureInfo | null;
    /** Iridescence intensity. See {@link Iridescence.getIridescenceTexture getIridescenceTexture}. */
    setIridescenceTexture(texture: Texture | null): this;
    /**********************************************************************************************
     * Iridescence IOR.
     */
    /** Index of refraction of the dielectric thin-film layer. */
    getIridescenceIOR(): number;
    /** Index of refraction of the dielectric thin-film layer. */
    setIridescenceIOR(ior: number): this;
    /**********************************************************************************************
     * Iridescence thickness.
     */
    /** Minimum thickness of the thin-film layer, in nanometers (nm). */
    getIridescenceThicknessMinimum(): number;
    /** Minimum thickness of the thin-film layer, in nanometers (nm). */
    setIridescenceThicknessMinimum(thickness: number): this;
    /** Maximum thickness of the thin-film layer, in nanometers (nm). */
    getIridescenceThicknessMaximum(): number;
    /** Maximum thickness of the thin-film layer, in nanometers (nm). */
    setIridescenceThicknessMaximum(thickness: number): this;
    /**
     * The green channel of this texture defines the thickness of the
     * thin-film layer by blending between the minimum and maximum thickness.
     */
    getIridescenceThicknessTexture(): Texture | null;
    /**
     * Settings affecting the material's use of its iridescence thickness texture.
     * If no texture is attached, {@link TextureInfo} is `null`.
     */
    getIridescenceThicknessTextureInfo(): TextureInfo | null;
    /**
     * Sets iridescence thickness texture.
     * See {@link Iridescence.getIridescenceThicknessTexture getIridescenceThicknessTexture}.
     */
    setIridescenceThicknessTexture(texture: Texture | null): this;
}
export {};
