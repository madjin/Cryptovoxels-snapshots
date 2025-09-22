import { ExtensionProperty, IProperty, Nullable, PropertyType, Texture, TextureInfo } from '@gltf-transform/core';
import { KHR_MATERIALS_ANISOTROPY } from '../constants.js';
interface IAnisotropy extends IProperty {
    anisotropyStrength: number;
    anisotropyRotation: number;
    anisotropyTexture: Texture;
    anisotropyTextureInfo: TextureInfo;
}
/**
 * Defines anisotropy (directionally-dependent reflections) on a PBR {@link Material}. See
 * {@link KHRMaterialsAnisotropy}.
 */
export declare class Anisotropy extends ExtensionProperty<IAnisotropy> {
    static EXTENSION_NAME: string;
    extensionName: typeof KHR_MATERIALS_ANISOTROPY;
    propertyType: 'Anisotropy';
    parentTypes: [PropertyType.MATERIAL];
    protected init(): void;
    protected getDefaults(): Nullable<IAnisotropy>;
    /**********************************************************************************************
     * Anisotropy strength.
     */
    /** Anisotropy strength. */
    getAnisotropyStrength(): number;
    /** Anisotropy strength. */
    setAnisotropyStrength(strength: number): this;
    /**********************************************************************************************
     * Anisotropy rotation.
     */
    /** Anisotropy rotation; linear multiplier. */
    getAnisotropyRotation(): number;
    /** Anisotropy rotation; linear multiplier. */
    setAnisotropyRotation(rotation: number): this;
    /**********************************************************************************************
     * Anisotropy texture.
     */
    /**
     * Anisotropy texture. Red and green channels represent the anisotropy
     * direction in [-1, 1] tangent, bitangent space, to be rotated by
     * anisotropyRotation. The blue channel contains strength as [0, 1] to be
     * multiplied by anisotropyStrength.
     */
    getAnisotropyTexture(): Texture | null;
    /**
     * Settings affecting the material's use of its anisotropy texture. If no
     * texture is attached, {@link TextureInfo} is `null`.
     */
    getAnisotropyTextureInfo(): TextureInfo | null;
    /** Anisotropy texture. See {@link Anisotropy.getAnisotropyTexture getAnisotropyTexture}. */
    setAnisotropyTexture(texture: Texture | null): this;
}
export {};
