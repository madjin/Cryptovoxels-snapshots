import { Extension, PropertyType, ReaderContext, WriterContext } from '@gltf-transform/core';
/**
 * [`EXT_texture_avif`](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_avif/)
 * enables AVIF images for any material texture.
 *
 * AVIF offers greatly reduced transmission size, but
 * [requires browser support](https://caniuse.com/avif). Like PNG and JPEG, an AVIF image is
 * *fully decompressed* when uploaded to the GPU, which increases upload time and GPU memory cost.
 * For seamless uploads and minimal GPU memory cost, it is necessary to use a GPU texture format
 * like Basis Universal, with the `KHR_texture_basisu` extension.
 *
 * Defining no {@link ExtensionProperty} types, this {@link Extension} is simply attached to the
 * {@link Document}, and affects the entire Document by allowing use of the `image/avif` MIME type
 * and passing AVIF image data to the {@link Texture.setImage} method. Without the Extension, the
 * same MIME types and image data would yield an invalid glTF document, under the stricter core glTF
 * specification.
 *
 * Properties:
 * - N/A
 *
 * ### Example
 *
 * ```typescript
 * import { TextureAVIF } from '@gltf-transform/extensions';
 *
 * // Create an Extension attached to the Document.
 * const avifExtension = document.createExtension(TextureAVIF)
 * 	.setRequired(true);
 * document.createTexture('MyAVIFTexture')
 * 	.setMimeType('image/avif')
 * 	.setImage(fs.readFileSync('my-texture.avif'));
 * ```
 *
 * AVIF conversion is not done automatically when adding the extension as shown above — you must
 * convert the image data first, then pass the `.avif` payload to {@link Texture.setImage}.
 *
 * When the `EXT_texture_avif` extension is added to a file by glTF-Transform, the extension should
 * always be required. This tool does not support writing assets that "fall back" to optional PNG or
 * JPEG image data.
 */
export declare class EXTTextureAVIF extends Extension {
    readonly extensionName = "EXT_texture_avif";
    /** @hidden */
    readonly prereadTypes: PropertyType[];
    static readonly EXTENSION_NAME = "EXT_texture_avif";
    /** @hidden */
    static register(): void;
    /** @hidden */
    preread(context: ReaderContext): this;
    /** @hidden */
    read(context: ReaderContext): this;
    /** @hidden */
    write(context: WriterContext): this;
}
