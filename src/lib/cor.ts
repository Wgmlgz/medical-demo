import {
  RenderingEngine,
  type Types,
  Enums,
  setVolumesForViewports,
  volumeLoader,
  utilities,
  CONSTANTS
} from '@cornerstonejs/core';
import { initDemo, createImageIdsAndCacheMetaData, cornerstoneTools } from './helpers';
import type { IStackViewport } from '@cornerstonejs/core/dist/esm/types';

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
cornerstoneTools.addTool(TrackballRotateTool);

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

await initDemo();

// Get Cornerstone imageIds and fetch metadata into RAM
const stackImageIds = await createImageIdsAndCacheMetaData({
  StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
  SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
  wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb'
});

// Get Cornerstone imageIds and fetch metadata into RAM
const volumeImageIds = await createImageIdsAndCacheMetaData({
  StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339',
  SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409',
  wadoRsRoot: 'https://domvja9iplmyu.cloudfront.net/dicomweb'
});

export const create = async (id: string, element: HTMLDivElement) => {
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

  // Set the tool group on the viewport

  // Get the stack viewport that was created
  const viewport = renderingEngine.getViewport(viewportId) as IStackViewport;

  // Define a stack containing a single image
  const stack = [stackImageIds[0], stackImageIds[1], stackImageIds[2]];

  // Set the stack on the viewport
  viewport.setStack(stack);
  toolGroup.addViewport(viewportId, renderingEngineId);
  console.log(toolGroup);

  // Render the image
  viewport.render();
};

export const create3d = async (id: string, content: HTMLDivElement) => {
  // Define a unique id for the volume
  const volumeName = `CT_VOLUME_ID${id}`; // Id of the volume less loader prefix
  const volumeLoaderScheme = `cornerstoneStreamingImageVolume`; // Loader id which defines which volume loader to use
  const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
  const renderingEngineId = `myRenderingEngine${id}`;
  const viewportId = `3D_VIEWPORT${id}`;
  const toolGroupId = `TOOL_GROUP_ID${id}`;

  const size = '500px';
  const viewportGrid = document.createElement('div');

  viewportGrid.style.display = 'flex';
  viewportGrid.style.display = 'flex';
  viewportGrid.style.flexDirection = 'row';

  const element1 = document.createElement('div');
  element1.oncontextmenu = () => false;

  element1.style.width = size;
  element1.style.height = size;

  viewportGrid.appendChild(element1);

  content.appendChild(viewportGrid);

  // Init Cornerstone and related libraries

  // Add tools to Cornerstone3D

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) throw Error('failed to create toolgroup');

  // Add the tools to the tool group and specify which volume they are pointing at
  toolGroup.addTool(TrackballRotateTool.toolName, {
    configuration: { volumeId }
  });

  // Set the initial state of the tools, here we set one tool active on left click.
  // This means left click will draw that tool.
  toolGroup.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary // Left Click
      }
    ]
  });

  // Instantiate a rendering engine
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create the viewports

  const viewportInputArray = [
    {
      viewportId: viewportId,
      type: ViewportType.VOLUME_3D,
      element: element1,
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
        background: <Types.Point3>[0.2, 0, 0.2]
      }
    }
  ];

  renderingEngine.setViewports(viewportInputArray);

  // Set the tool group on the viewports
  toolGroup.addViewport(viewportId, renderingEngineId);

  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds: volumeImageIds
  });
  // Set the volume to load
  volume.load();

  await setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]);

  const viewport = renderingEngine.getViewport(viewportId);

  const volumeActor = renderingEngine.getViewport(viewportId).getDefaultActor()
    .actor as Types.VolumeActor;

  const preset = findPreset('CT-Bone');
  utilities.applyPreset(volumeActor, preset);

  viewport.render();
  renderingEngine.render();

  const select = (presetName: string) => {
    const volumeActor = renderingEngine.getViewport(viewportId).getDefaultActor()
      .actor as Types.VolumeActor;

    const preset = findPreset(presetName);
    utilities.applyPreset(volumeActor, preset);

    renderingEngine.render();
  };
  return {
    select,
    options: CONSTANTS.VIEWPORT_PRESETS.map((preset, idx) => ({ id: idx, text: preset.name }))
  };
};

const findPreset = (presetName: string) => {
  const preset = CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === presetName);
  if (!preset) throw Error('cannot find preset');
  return preset;
};
