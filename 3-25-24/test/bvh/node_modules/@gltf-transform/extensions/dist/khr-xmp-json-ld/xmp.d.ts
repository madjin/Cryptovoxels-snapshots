import { Extension, ReaderContext, WriterContext } from '@gltf-transform/core';
import { Packet } from './packet.js';
/**
 * [KHR_xmp_json_ld](https://github.com/KhronosGroup/gltf/blob/main/extensions/2.0/Khronos/KHR_xmp_json_ld/)
 * defines XMP metadata associated with a glTF asset.
 *
 * XMP metadata provides standardized fields describing the content, provenance, usage
 * restrictions, or other attributes of a 3D model. XMP metadata does not generally affect the
 * parsing or runtime behavior of the content — for that, use custom extensions, custom vertex
 * attributes, or extras. Similarly, storage mechanisms other than XMP should be preferred
 * for binary content like mesh data, animations, or textures.
 *
 * Generally XMP metadata is associated with the entire glTF asset by attaching an XMP {@link Packet}
 * to the document {@link Root}. In less common cases where metadata must be associated with
 * specific subsets of a document, XMP Packets may be attached to {@link Scene}, {@link Node},
 * {@link Mesh}, {@link Material}, {@link Texture}, or {@link Animation} properties.
 *
 * Within each packet, XMP properties become available when an
 * [XMP namespace](https://www.adobe.io/xmp/docs/XMPNamespaces/) is registered
 * with {@link Packet.setContext}. Packets cannot use properties whose namespaces are not
 * registered as context. While not all XMP namespaces are relevant to 3D assets, some common
 * namespaces provide useful metadata about authorship and provenance. Additionally, the `model3d`
 * namespace provides certain properties specific to 3D content, such as Augmented Reality (AR)
 * orientation data.
 *
 * Common XMP contexts for 3D models include:
 *
 * | Prefix      | URI                                         | Name                           |
 * |:------------|:--------------------------------------------|:-------------------------------|
 * | `dc`        | http://purl.org/dc/elements/1.1/            | Dublin Core                    |
 * | `model3d`   | https://schema.khronos.org/model3d/xsd/1.0/ | Model 3D                       |
 * | `rdf`       | http://www.w3.org/1999/02/22-rdf-syntax-ns# | Resource Description Framework |
 * | `xmp`       | http://ns.adobe.com/xap/1.0/                | XMP                            |
 * | `xmpRights` | http://ns.adobe.com/xap/1.0/rights/         | XMP Rights Management          |
 *
 * Only the XMP contexts required for a packet should be assigned, and different packets
 * in the same asset may use different contexts. For greater detail on available XMP
 * contexts and how to use them in glTF assets, see the
 * [3DC Metadata Recommendations](https://github.com/KhronosGroup/3DC-Metadata-Recommendations/blob/main/model3d.md).
 *
 * Properties:
 * - {@link Packet}
 *
 * ### Example
 *
 * ```typescript
 * import { KHRXMP, Packet } from '@gltf-transform/extensions';
 *
 * // Create an Extension attached to the Document.
 * const xmpExtension = document.createExtension(KHRXMP);
 *
 * // Create Packet property.
 * const packet = xmpExtension.createPacket()
 * 	.setContext({
 * 		dc: 'http://purl.org/dc/elements/1.1/',
 * 	})
 *	.setProperty('dc:Creator', {"@list": ["Acme, Inc."]});
 *
 * // Option 1: Assign to Document Root.
 * document.getRoot().setExtension('KHR_xmp_json_ld', packet);
 *
 * // Option 2: Assign to a specific Property.
 * texture.setExtension('KHR_xmp_json_ld', packet);
 * ```
 */
export declare class KHRXMP extends Extension {
    readonly extensionName = "KHR_xmp_json_ld";
    static readonly EXTENSION_NAME = "KHR_xmp_json_ld";
    /** Creates a new XMP packet, to be linked with a {@link Document} or {@link Property Properties}. */
    createPacket(): Packet;
    /** Lists XMP packets currently defined in a {@link Document}. */
    listPackets(): Packet[];
    /** @hidden */
    read(context: ReaderContext): this;
    /** @hidden */
    write(context: WriterContext): this;
}
