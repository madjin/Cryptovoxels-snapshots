//
// This is the Node.js script used to precompute the bvh and store it in a GLTF file.
//
import { Accessor, Extension, ExtensionProperty, NodeIO, PropertyType, ReaderContext, VertexLayout, WriterContext } from '@gltf-transform/core';
import { PropertyGraph } from '@gltf-transform/core/dist/properties';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { join, normalize, resolve } from 'path';
import { Box3, BufferGeometry, Float32BufferAttribute } from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import yargs from 'yargs';

const NAME = "three_mesh_bvh";

class ThreeMeshBvh extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public createThreeMeshBVH(roots: Accessor[]): ThreeMeshBVH {
    return new ThreeMeshBVH(this.doc.getGraph(), this, roots);
  }

  public read(_context: ReaderContext): this {
    // We don't currently support reading these out.
    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;
    this.doc.getRoot()
      .listMeshes()
      .forEach((mesh) => {
        const meshIndex = context.meshIndexMap.get(mesh)!;
        const meshDef = jsonDoc.json.meshes![meshIndex];
        mesh.listPrimitives()
          .forEach((prim, index) => {
            const bvh = prim.getExtension<ThreeMeshBVH>(NAME);
            if (bvh) {
              const primDef = meshDef.primitives[index];
              primDef.extensions = primDef.extensions || {};
              primDef.extensions[NAME] = {
                roots: bvh.roots.map(root => context.accessorIndexMap.get(root))
              };
            }
          });
      })
    return this;
  }
}

class ThreeMeshBVH extends ExtensionProperty {
  public readonly propertyType = 'ThreeMeshBVH';
  public readonly parentTypes = [PropertyType.PRIMITIVE];
  public readonly extensionName = NAME;
  public static EXTENSION_NAME = NAME;

  constructor(graph: PropertyGraph, extension: Extension, public roots: Accessor[]) {
    super(graph, extension);
  }
}

async function main() {
  const argv = yargs(process.argv)
    .usage('Compute BVH for a GLTF file output the result into a new GLTF file.')
    .example('node $0 -i input.gltf -o output.gltf', 'Compute BVH for input.gltf, put the result in output.gltf')
    .help('h')
    .alias('h', 'help')
    .options({
      inputFile: {
        alias: 'i',
        describe: 'Input GLTF file',
        type: 'string',
        demandOption: true,
      },
      outputFile: {
        alias: 'o',
        describe: 'Output GLTF file',
        type: 'string',
        demandOption: true,
      }
    }).parseSync();
  let { inputFile, outputFile } = argv;

  const nodeIo = new NodeIO();
  nodeIo.setVertexLayout(VertexLayout.INTERLEAVED); 
  nodeIo.registerExtensions(KHRONOS_EXTENSIONS);

  const doc = nodeIo.read(inputFile);
  const extension = doc.createExtension(ThreeMeshBvh);
  const modelAABB = new Box3();
  modelAABB.makeEmpty();
  doc.getRoot()
    .listMeshes()
    .forEach(mesh => {
      const geom = new BufferGeometry();
      mesh.listPrimitives().forEach(primitive => {
        const indices = primitive.getIndices().getArray();
        geom.setIndex(Array.from(indices));
        geom.setAttribute('position', new Float32BufferAttribute(primitive.getAttribute("POSITION").getArray(), 3));
        geom.computeBoundingBox();
        modelAABB.expandByPoint(geom.boundingBox.min);
        modelAABB.expandByPoint(geom.boundingBox.max);
        const computedBvh = new MeshBVH(geom, { strategy: 1, maxLeafTris: 32 });
        const bvh = MeshBVH.serialize(computedBvh, geom, false);
        // // MeshBVH requires indices in a certain order
        primitive.getIndices().setArray(bvh.index);
        const accessors = bvh.roots.map((root: ArrayBuffer, index: number) => {
          const name = `${mesh.getName()}-bvh-${index}`;
          const accessor = doc.createAccessor(name)
            .setType(Accessor.Type.SCALAR)
            .setBuffer(doc.getRoot().listBuffers()[0])
            .setArray(new Uint8Array(root));
          return accessor;
        });
        primitive.setExtension(NAME, extension.createThreeMeshBVH(accessors));
      });
    });
    nodeIo.write(outputFile, doc);
}

main();

//
// Here is the Three.JS extension
//
import { Group, Mesh, SkinnedMesh } from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { GLTFLoaderPlugin, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader';

export class MeshBvh implements GLTFLoaderPlugin {
  public name = 'three_mesh_bvh';

  constructor (private parser: GLTFParser) {
  }

  public async loadMesh( meshIndex: number ): Promise<Group | Mesh | SkinnedMesh> {
    // Loads the pre-computed BVH from a gltf primitive into a Three Mesh.
    const loadBVHForMesh = async (mesh: Mesh, primIndex: number): Promise<void> => {
      const primitiveDef = this.parser.json.meshes[meshIndex].primitives[primIndex];
      if (primitiveDef.extensions?.three_mesh_bvh) {
        const bvhInfo = primitiveDef.extensions?.three_mesh_bvh;
        const roots = await Promise.all(bvhInfo.roots.map((root: number) => {
          return this.parser.loadAccessor(root);
        }));
        const bvhSerialized = {
          roots: roots.map(root => (root as any).array.buffer),
          index: undefined,
        };
        (mesh.geometry as any).boundsTree = MeshBVH.deserialize(bvhSerialized, mesh.geometry, false);
      }
    };

    // Just use the standard loadMesh path, we only want to augment the meshes with extra data.
    const waitFor: Array<Promise<void>> = [];
    const result = await this.parser.loadMesh(meshIndex);
    if (result) {
      if (result.type === 'Group') {
        const group = result as Group;
        waitFor.push(...group.children.map((m, i) => loadBVHForMesh(m as Mesh, i)));
      } else if (result.type === 'Mesh') {
        waitFor.push(loadBVHForMesh(result as Mesh, 0));
      }
    }
    await Promise.all(waitFor);
    return result;
  }
}

// 
// Register the extension with the GLTFLoader
//
const loader = new GLTFLoader(loadingManager);
loader.register((parser) => {
  return new MeshBvh(parser);
});
