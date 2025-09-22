import { Extension, ReaderContext, WriterContext } from '@gltf-transform/core';
import { Specular } from './specular.js';
/**
 * [`KHR_materials_specular`](https://github.com/KhronosGroup/gltf/blob/main/extensions/2.0/Khronos/KHR_materials_specular/)
 * adjusts the strength of the specular reflection in the dielectric BRDF.
 *
 * KHRMaterialsSpecular is a better alternative to the older
 * {@link KHRMaterialsPBRSpecularGlossiness KHR_materials_pbrSpecularGlossiness} extension, and
 * provides specular information while remaining within a metal/rough PBR workflow. A
 * value of zero disables the specular reflection, resulting in a pure diffuse material.
 *
 * Properties:
 * - {@link Specular}
 *
 * ### Example
 *
 * The `KHRMaterialsSpecular` class provides a single {@link ExtensionProperty} type, `Specular`,
 * which may be attached to any {@link Material} instance. For example:
 *
 * ```typescript
 * import { KHRMaterialsSpecular, Specular } from '@gltf-transform/extensions';
 *
 * // Create an Extension attached to the Document.
 * const specularExtension = document.createExtension(KHRMaterialsSpecular);
 *
 * // Create a Specular property.
 * const specular = specularExtension.createSpecular()
 * 	.setSpecularFactor(1.0);
 *
 * // Attach the property to a Material.
 * material.setExtension('KHR_materials_specular', specular);
 * ```
 */
export declare class KHRMaterialsSpecular extends Extension {
    readonly extensionName = "KHR_materials_specular";
    static readonly EXTENSION_NAME = "KHR_materials_specular";
    /** Creates a new Specular property for use on a {@link Material}. */
    createSpecular(): Specular;
    /** @hidden */
    read(context: ReaderContext): this;
    /** @hidden */
    write(context: WriterContext): this;
}
