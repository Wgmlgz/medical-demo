import createImageIdsAndCacheMetaData from './createImageIdsAndCacheMetaData';
import wadoURICreateImageIds from './WADOURICreateImageIds';
import initDemo from './initDemo';
import setCtTransferFunctionForVolumeActor, {
  ctVoiRange
} from './setCtTransferFunctionForVolumeActor';
import setPetTransferFunctionForVolumeActor from './setPetTransferFunctionForVolumeActor';
import setPetColorMapTransferFunctionForVolumeActor from './setPetColorMapTransferFunctionForVolumeActor';
import camera from './camera';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as cornerstoneToolsRaw from '@cornerstonejs/tools/dist/umd';
import { CONSTANTS } from '@cornerstonejs/core';

const cornerstoneTools: typeof import('@cornerstonejs/tools') = cornerstoneToolsRaw;

export {
  createImageIdsAndCacheMetaData,
  wadoURICreateImageIds,
  initDemo,
  setPetColorMapTransferFunctionForVolumeActor,
  setPetTransferFunctionForVolumeActor,
  setCtTransferFunctionForVolumeActor,
  ctVoiRange,
  camera,
  cornerstoneTools
};

export const findPreset = (presetName: string) => {
  const preset = CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === presetName);
  if (!preset) throw Error('cannot find preset');
  return preset;
};
