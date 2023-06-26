import { resize } from 'cornerstone-core';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  RenderingEngine,
  type Types,
  Enums,
  setVolumesForViewports,
  volumeLoader,
  utilities,
  CONSTANTS,
  cache
} from '@cornerstonejs/core';
import { initDemo, createImageIdsAndCacheMetaData, cornerstoneTools, findPreset } from './helpers';
import type {
  IStackViewport,
  IVolumeViewport,
  PublicViewportInput
} from '@cornerstonejs/core/dist/esm/types';
// @ts-ignore
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import {
  convertMultiframeImageIds,
  prefetchMetadataInformation
} from './helpers/convertMultiframeImageIds';
import { SusTool, type onWindowFn } from './sus_tool';
import jszip from 'jszip';
import path from 'path-browserify';
import type { WindowLevelTool } from '@cornerstonejs/tools';

const {
  PanTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  TrackballRotateTool,
  ZoomTool,
  PlanarRotateTool,
  ToolGroupManager,
  Enums: csToolsEnums
} = cornerstoneTools;

// Add tools to Cornerstone3D
cornerstoneTools.addTool(PanTool);
cornerstoneTools.addTool(WindowLevelTool);
cornerstoneTools.addTool(StackScrollMouseWheelTool);
cornerstoneTools.addTool(ZoomTool);
cornerstoneTools.addTool(PlanarRotateTool);
cornerstoneTools.addTool(SusTool);
cornerstoneTools.addTool(TrackballRotateTool);

const { ViewportType, Events } = Enums;
const { MouseBindings } = csToolsEnums;

await initDemo();

// Get Cornerstone imageIds and fetch metadata into RAM
export const stackImageIds = await createImageIdsAndCacheMetaData({
  StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
  SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
  wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb'
});

// Get Cornerstone imageIds and fetch metadata into RAM
export const volumeImageIds = await createImageIdsAndCacheMetaData({
  StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339',
  SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409',
  wadoRsRoot: 'https://domvja9iplmyu.cloudfront.net/dicomweb'
});

export const createStack = async (
  id: string,
  element: HTMLDivElement,
  imageIds: string[],
  onImageId?: (n: number) => void
) => {
  const toolGroupId = `STACK_TOOL_GROUP_ID${id}`;
  const renderingEngineId = `myRenderingEngine${id}`;
  const viewportId = `CT_STACK${id}`;

  const leftClickTools = [WindowLevelTool.toolName, PlanarRotateTool.toolName];
  const defaultLeftClickTool = leftClickTools[0];

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) throw Error('failed to create toolgroup');

  // Add tools to the tool group
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName, { loop: true });
  toolGroup.addTool(PlanarRotateTool.toolName);

  // Set the initial state of the tools, here all tools are active and bound to
  // Different mouse inputs
  toolGroup.setToolActive(defaultLeftClickTool, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary // Middle Click
      }
    ]
  });
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary // Left Click
      }
    ]
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary // Right Click
      }
    ]
  });
  // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
  // hook instead of mouse buttons, it does not need to assign any mouse button.
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  element.addEventListener(Events.STACK_NEW_IMAGE, (e: any) => {
    onImageId && onImageId(e.detail.imageIdIndex);
  });
  // element.addEventListener(Events.STACK_VIEWPORT_NEW_STACK, (e) => {
  //   console.log(e);
  // });
  // Instantiate a rendering engine

  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create a stack viewport
  const viewportInput = {
    viewportId,
    type: ViewportType.STACK,
    element,
    defaultOptions: {
      background: <Types.Point3>[0.2, 0, 0.2]
    }
  };

  renderingEngine.enableElement(viewportInput);

  const viewport = renderingEngine.getViewport(viewportId) as IStackViewport;

  // const stack = [stackImageIds[0], stackImageIds[1], stackImageIds[2]];
  // viewport.setStack(volumeImageIds);
  updateStack(viewport, imageIds);
  toolGroup.addViewport(viewportId, renderingEngineId);
  viewport.render();
  console.log(viewport.getProperties())
  console.log((toolGroup.getToolInstance(WindowLevelTool.toolName) as WindowLevelTool).get)

  const loadFile = async (files: readonly File[]) => {
    await loadAndViewStackImage(viewport, files);
  };
  const fixSize = () => {
    renderingEngine.resize();
  };
  return {
    loadFile,
    fixSize,
    viewport,
    Events
  };
};

export const createVolume = async (
  id: string,
  content: HTMLDivElement,
  imageIds: string[],
  onWindow?: onWindowFn
) => {
  // Define a unique id for the volume
  const volumeName = `CT_VOLUME_ID${id}`; // Id of the volume less loader prefix
  const volumeLoaderScheme = `cornerstoneStreamingImageVolume`; // Loader id which defines which volume loader to use
  const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
  const renderingEngineId = `myRenderingEngine${id}`;
  const viewportId = `3D_VIEWPORT${id}`;
  const toolGroupId = `TOOL_GROUP_ID${id}`;
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) throw Error('failed to create toolgroup');

  // Add the tools to the tool group and specify which volume they are pointing at
  toolGroup.addTool(TrackballRotateTool.toolName, {
    configuration: { volumeId }
  });
  toolGroup.addTool(SusTool.toolName, {
    configuration: {
      volumeId,
      onChange: onWindow
    }
  });
  toolGroup.addTool(ZoomTool.toolName);

  // Set the initial state of the tools, here we set one tool active on left click.
  // This means left click will draw that tool.
  toolGroup.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary // Left Click
      }
    ]
  });

  toolGroup.setToolActive(SusTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary // Middle Click
      }
    ]
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary // Right Click
      }
    ]
  });
  
  // Instantiate a rendering engine
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create the viewports

  const viewportInputArray: PublicViewportInput[] = [
    {
      viewportId: viewportId,
      type: ViewportType.VOLUME_3D,
      element: content,
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
        background: <Types.Point3>[0.2, 0, 0.2]
      }
    }
  ];

  renderingEngine.setViewports(viewportInputArray);

  // Set the tool group on the viewports
  toolGroup.addViewport(viewportId, renderingEngineId);
  const viewport = renderingEngine.getViewport(viewportId);
  renderingEngine.render();

  await updateVolume(volumeId, renderingEngine, viewportId, imageIds);

  // viewport.render();
  // renderingEngine.render();

  // element1.style.width = '3000px';
  // element1.style.height = '3000px';
  // renderingEngine.setViewports(viewportInputArray);
  renderingEngine.render();

  const selectPreset = (presetName: string) => {
    const volumeActor = viewport.getDefaultActor()
      .actor as Types.VolumeActor;

    const preset = findPreset(presetName);
    utilities.applyPreset(volumeActor, preset);

    toolGroup.getToolInstance(SusTool.toolName).refresh(viewport)
    renderingEngine.render();
  };

  const loadFile = async (files: readonly File[]) => {
    await loadAndViewVolumeImage(volumeId, renderingEngine, viewportId, files);
  };
  const fixSize = () => {
    renderingEngine.resize();
  };

  selectPreset('CT-Bone')
  return {
    selectPreset,
    loadFile,
    fixSize,
    options: CONSTANTS.VIEWPORT_PRESETS.map((preset, idx) => ({ id: idx, text: preset.name }))
  };
};

async function loadAndViewStackImage(viewport: IStackViewport, files: readonly File[]) {
  const stack = await preloadImage(files);
  await updateStack(viewport, stack);
}
const updateStack = async (viewport: IStackViewport, imageIds: string[]) => {
  await viewport.setStack(imageIds);
  viewport.render();

  const imageData = viewport.getImageData();
};

async function loadAndViewVolumeImage(
  volumeId: string,
  renderingEngine: RenderingEngine,
  viewportId: string,
  files: readonly File[]
) {
  const stackImageIds = await preloadImage(files);

  // Define a volume in memory
  updateVolume(volumeId, renderingEngine, viewportId, stackImageIds);
}
const updateVolume = async (
  volumeId: string,
  renderingEngine: RenderingEngine,
  viewportId: string,
  imageIds: string[]
) => {
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds
  });

  // Set the volume to load
  volume.load();

  await setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]);

  const volumeActor = renderingEngine.getViewport(viewportId).getDefaultActor()
    .actor as Types.VolumeActor;

  // const preset = findPreset('CT-Bone');
  // utilities.applyPreset(volumeActor, preset);

  const viewport = renderingEngine.getViewport(viewportId);
  viewport.render();
  // Set the stack on the viewport
  // Set the VOI of the stack
  // viewport.setProperties({ voiRange: ctVoiRange });
  // Render the image
  // viewport.render();

  // const imageData = viewport.getImageData();
};

const file2stack = async (file: File) => {
  const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
  await prefetchMetadataInformation([imageId]);
  const stack = convertMultiframeImageIds([imageId]);
  return stack;
};
const files2stack = async (
  files: readonly (File | Promise<File | null>)[],
  onProgress?: (x: number) => void
) => {
  const promises = files.map(async (raw_file) => {
    const file = await raw_file;
    if (file === null) return [];
    return file2stack(file);
  });

  let d = 0;
  onProgress && onProgress(0);
  for (const p of promises) {
    p.then(() => {
      d++;
      onProgress && onProgress(d / promises.length);
    });
  }

  const new_stack = (await Promise.all(promises)).flat();
  return new_stack;
};
export const preloadImage = async (
  files: readonly File[],
  onProgress?: (x: number) => void
): Promise<string[]> => {
  onProgress && onProgress(0.0);
  cache.purgeCache();
  cache.purgeVolumeCache();
  onProgress && onProgress(0.1);

  let res: string[] = [];
  if (files.length === 1) {
    const file = files[0];
    if (file.name.split('.').pop() === 'zip') {
      const zip = await jszip.loadAsync(file);
      onProgress && onProgress(0.2);

      const files = Object.values(zip.files);
      res = await files2stack(
        files.map(async (zobj) => {
          if (zobj.dir) return null;
          return new File([await zobj.async('blob')], path.basename(zobj.name), {
            lastModified: zobj.date.getTime(),
            type: 'application/zip'
          });
        }),
        (x) => {
          onProgress && onProgress(x * 0.8 + 0.2);
        }
      );
    } else {
      res = await file2stack(file);
    }
  } else {
    res = await files2stack(files, onProgress);
    // throw new Error('todo')
  }
  onProgress && onProgress(1);
  return res;
};
