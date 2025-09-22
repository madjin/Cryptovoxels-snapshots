import { Extension, ReaderContext, WriterContext } from '@gltf-transform/core';
import { Anisotropy } from './anisotropy.js';
/**
 * [`KHR_materials_anisotropy`](https://github.com/KhronosGroup/gltf/blob/main/extensions/2.0/Khronos/KHR_materials_anisotropy/)
 * defines anisotropy (directionally-dependent reflections) on a PBR material.
 *
 * This extension defines the anisotropic property of a material as observable with brushed metals
 * for instance. An asymmetric specular lobe model is introduced to allow for such phenomena. The
 * visually distinct feature of that lobe is the elongated appearance of the specular reflection.
 * For a single punctual light source, the specular reflection will eventually degenerate into a
 * zero width line in the limit, that is where the material is fully anisotropic, as opposed to be
 * fully isotropic in which case the specular reflection is radially symmetric.
 *
 * Properties:
 * - {@link Anisotropy}
 *
 * ### Example
 *
 * The `KHRMaterialsAnisotropy` class provides a single {@link ExtensionProperty} type, `Anisotropy`,
 * which may be attached to any {@link Material} instance. For example:
 *
 * ```typescript
 * import { KHRMaterialsAnisotropy, Anisotropy } from '@gltf-transform/extensions';
 *
 * // Create an Extension attached to the Document.
 * const anisotropyExtension = document.createExtension(KHRMaterialsAnisotropy);
 *
 * // Create an Anisotropy property.
 * const anisotropy = anisotropyExtension.createAnisotropy()
 * 	.setAnisotropyStrength(1.0)
 * 	.setAnisotropyRotation(Math.PI / 4);
 *
 * // Attach the property to a Material.
 * material.setExtension('KHR_materials_anisotropy', anisotropy);
 * ```
 */
export declare class KHRMaterialsAnisotropy extends Extension {
    readonly extensionName = "KHR_materials_anisotropy";
    static readonly EXTENSION_NAME = "KHR_materials_anisotropy";
    /** Creates a new Anisotropy property for use on a {@link Material}. */
    createAnisotropy(): Anisotropy;
    /** @hidden */
    read(context: ReaderContext): this;
    /** @hidden */
    write(context: WriterContext): this;
}
