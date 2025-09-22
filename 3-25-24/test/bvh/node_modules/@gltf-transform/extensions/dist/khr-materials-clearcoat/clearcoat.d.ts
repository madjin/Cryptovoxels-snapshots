import { ExtensionProperty, IProperty, Nullable, PropertyType, Texture, TextureInfo } from '@gltf-transform/core';
import { KHR_MATERIALS_CLEARCOAT } from '../constants.js';
interface IClearcoat extends IProperty {
    clearcoatFactor: number;
    clearcoatTexture: Texture;
    clearcoatTextureInfo: TextureInfo;
    clearcoatRoughnessFactor: number;
    clearcoatRoughnessTexture: Texture;
    clearcoatRoughnessTextureInfo: TextureInfo;
    clearcoatNormalScale: number;
    clearcoatNormalTexture: Texture;
    clearcoatNormalTextureInfo: TextureInfo;
}
/**
 * Defines clear coat for a PBR material. See {@link KHRMaterialsClearcoat}.
 */
export declare class Clearcoat extends ExtensionProperty<IClearcoat> {
    static EXTENSION_NAME: string;
    extensionName: typeof KHR_MATERIALS_CLEARCOAT;
    propertyType: 'Clearcoat';
    parentTypes: [PropertyType.MATERIAL];
    protected init(): void;
    protected getDefaults(): Nullable<IClearcoat>;
    /**********************************************************************************************
     * Clearcoat.
     */
    /** Clearcoat; linear multiplier. See {@link Clearcoat.getClearcoatTexture getClearcoatTexture}. */
    getClearcoatFactor(): number;
    /** Clearcoat; linear multiplier. See {@link Clearcoat.getClearcoatTexture getClearcoatTexture}. */
    setClearcoatFactor(factor: number): this;
    /**
     * Clearcoat texture; linear multiplier. The `r` channel of this texture specifies an amount
     * [0-1] of coating over the surface of the material, which may have its own roughness and
     * normal map properties.
     */
    getClearcoatTexture(): Texture | null;
    /**
     * Settings affecting the material's use of its clearcoat texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getClearcoatTextureInfo(): TextureInfo | null;
    /** Sets clearcoat texture. See {@link Clearcoat.getClearcoatTexture getClearcoatTexture}. */
    setClearcoatTexture(texture: Texture | null): this;
    /**********************************************************************************************
     * Clearcoat roughness.
     */
    /**
     * Clearcoat roughness; linear multiplier.
     * See {@link Clearcoat.getClearcoatRoughnessTexture getClearcoatRoughnessTexture}.
     */
    getClearcoatRoughnessFactor(): number;
    /**
     * Clearcoat roughness; linear multiplier.
     * See {@link Clearcoat.getClearcoatRoughnessTexture getClearcoatRoughnessTexture}.
     */
    setClearcoatRoughnessFactor(factor: number): this;
    /**
     * Clearcoat roughness texture; linear multiplier. The `g` channel of this texture specifies
     * roughness, independent of the base layer's roughness.
     */
    getClearcoatRoughnessTexture(): Texture | null;
    /**
     * Settings affecting the material's use of its clearcoat roughness texture. If no texture is
     * attached, {@link TextureInfo} is `null`.
     */
    getClearcoatRoughnessTextureInfo(): TextureInfo | null;
    /**
     * Sets clearcoat roughness texture.
     * See {@link Clearcoat.getClearcoatRoughnessTexture getClearcoatRoughnessTexture}.
     */
    setClearcoatRoughnessTexture(texture: Texture | null): this;
    /**********************************************************************************************
     * Clearcoat normals.
     */
    /** Clearcoat normal scale. See {@link Clearcoat.getClearcoatNormalTexture getClearcoatNormalTexture}. */
    getClearcoatNormalScale(): number;
    /** Clearcoat normal scale. See {@link Clearcoat.getClearcoatNormalTexture getClearcoatNormalTexture}. */
    setClearcoatNormalScale(scale: number): this;
    /**
     * Clearcoat normal map. Independent of the material base layer normal map.
     */
    getClearcoatNormalTexture(): Texture | null;
    /**
     * Settings affecting the material's use of its clearcoat normal texture. If no texture is
     * attached, {@link TextureInfo} is `null`.
     */
    getClearcoatNormalTextureInfo(): TextureInfo | null;
    /** Sets clearcoat normal texture. See {@link Clearcoat.getClearcoatNormalTexture getClearcoatNormalTexture}. */
    setClearcoatNormalTexture(texture: Texture | null): this;
}
export {};
