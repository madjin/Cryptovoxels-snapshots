import { Extension, ReaderContext, WriterContext } from '@gltf-transform/core';
import { Iridescence } from './iridescence.js';
/**
 * [`KHR_materials_iridescence`](https://github.com/KhronosGroup/gltf/blob/main/extensions/2.0/Khronos/KHR_materials_iridescence/)
 * defines iridescence (thin film interference) on a PBR material.
 *
 * Iridescence describes an effect where hue varies depending on the viewing
 * angle and illumination angle: A thin-film of a semi-transparent layer
 * results in inter-reflections and due to thin-film interference, certain
 * wavelengths get absorbed or amplified. Iridescence can be seen on soap
 * bubbles, oil films, or on the wings of many insects. With this extension,
 * thickness and index of refraction (IOR) of the thin-film can be specified,
 * enabling iridescent materials.
 *
 * Properties:
 * - {@link Iridescence}
 *
 * ### Example
 *
 * The `KHRMaterialsIridescence` class provides a single {@link ExtensionProperty} type, `Iridescence`,
 * which may be attached to any {@link Material} instance. For example:
 *
 * ```typescript
 * import { KHRMaterialsIridescence, Iridescence } from '@gltf-transform/extensions';
 *
 * // Create an Extension attached to the Document.
 * const iridescenceExtension = document.createExtension(KHRMaterialsIridescence);
 *
 * // Create an Iridescence property.
 * const iridescence = iridescenceExtension.createIridescence()
 * 	.setIridescenceFactor(1.0)
 * 	.setIridescenceIOR(1.8);
 *
 * // Attach the property to a Material.
 * material.setExtension('KHR_materials_iridescence', iridescence);
 * ```
 */
export declare class KHRMaterialsIridescence extends Extension {
    readonly extensionName = "KHR_materials_iridescence";
    static readonly EXTENSION_NAME = "KHR_materials_iridescence";
    /** Creates a new Iridescence property for use on a {@link Material}. */
    createIridescence(): Iridescence;
    /** @hidden */
    read(context: ReaderContext): this;
    /** @hidden */
    write(context: WriterContext): this;
}
