<script lang="ts">
  import type { RenderingEngine } from '@cornerstonejs/core';

  // import { RenderingEngine } from '@cornerstonejs/core';
  import { onMount } from 'svelte';

  let element: HTMLElement;
  let viewport;
  let cornerstone: typeof import('@cornerstonejs/core');
  let renderingEngine: RenderingEngine;

  const imageIds = ['example://1', 'example://2'];

  let topleft = '';
  let topright = '';
  let bottomleft = '';
  let bottomright = '';
  let coords = '';
  let currentImageIndex = 0;

  let lastX: number;
  let lastY: number;
  let mouseButton: number;

  let enable_mouse_move = false;

  // updates the image display
  async function updateTheImage(imageIndex: number) {
    const image = await cornerstone.loadAndCacheImage(imageIds[imageIndex]);
    currentImageIndex = imageIndex;
    const viewport = cornerstone.getViewport(element);
    renderingEngine.displayImage(element, image, viewport);
  }

  function onImageRendered(e) {
    const eventData = e.detail;

    // set the canvas context to the image coordinate system
    renderingEngine.setToPixelCoordinateSystem(eventData.enabledElement, eventData.canvasContext);

    // NOTE: The coordinate system of the canvas is in image pixel space.  Drawing
    // to location 0,0 will be the top left of the image and rows,columns is the bottom
    // right.
    const context = eventData.canvasContext;
    context.beginPath();
    context.strokeStyle = 'white';
    context.lineWidth = 0.5;
    context.rect(128, 90, 50, 60);
    context.stroke();
    context.fillStyle = 'white';
    context.font = '6px Arial';
    context.fillText('Tumor Here', 128, 85);

    topright = 'Render Time:' + eventData.renderTimeInMs + ' ms';
    bottomleft =
      'WW/WL:' +
      Math.round(eventData.viewport.voi.windowWidth) +
      '/' +
      Math.round(eventData.viewport.voi.windowCenter);
    bottomright = 'Zoom:' + eventData.viewport.scale.toFixed(2);
  }

  onMount(async () => {
    cornerstone = await import('@cornerstonejs/core');

    const renderingEngineId = 'myRenderingEngine';
    renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

    const viewportId = 'CT_AXIAL_STACK';

    const viewportInput = {
      viewportId,
      element,
      type: ViewportType.STACK
    };
    renderingEngine.enableElement(viewportInput);

    //     const imageIds = await createImageIdsAndCacheMetaData({
    //   StudyInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    //   SeriesInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    //   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
    // });

    const { init } = await import('./exampleImageIdLoader');
    init(renderingEngine);

    // image enable the element

    // setup handlers before we display the image

    element.addEventListener('cornerstoneimagerendered', onImageRendered);

    // load and display the image
    const imagePromise = await updateTheImage(0);

    // add handlers for mouse events once the image is loaded.
    // add event handlers to pan image on mouse move

    // const mouseWheelEvents = ['mousewheel', 'DOMMouseScroll'] as const;
    // mouseWheelEvents.forEach();

    // Add event handler to the ww/wc apply button
    // document.getElementById('x256').addEventListener('click', );

    // document.getElementById('x512').addEventListener('click', );

    // document.getElementById('invert').addEventListener('click', );

    // document.getElementById('interpolation').addEventListener('click', );
    // document.getElementById('hflip').addEventListener('click', );
    // document.getElementById('vflip').addEventListener('click', );
    // document.getElementById('rotate').addEventListener('click', );

    // element.addEventListener('mousemove', );
  });
</script>

<div class="container">
  <h1>scrollzoompanwl/index.html</h1>

  This is an example of interactive series scroll, pan, zoom and window/level with HTML based
  overlays.

  <br />
  <br />

  Controls:
  <ul>
    <li>Left click drag - window/level</li>
    <li>Middle Mouse button drag - pan</li>
    <li>Right click drag - zoom</li>
    <li>Mouse wheel - scroll images</li>
  </ul>

  <button
    id="x256"
    class="btn"
    on:click={function (e) {
      element.style.width = '256px';
      element.style.height = '256px';
      renderingEngine.resize(element);
    }}>256x256</button
  >
  <button
    id="x512"
    class="btn"
    on:click={function (e) {
      element.style.width = '512px';
      element.style.height = '512px';
      renderingEngine.resize(element);
    }}>512x512</button
  >
  <button
    id="invert"
    class="btn"
    on:click={function (e) {
      const viewport = cornerstone.getViewport(element);
      if (!viewport) return;

      viewport.invert = !viewport.invert;
      renderingEngine.setViewport(element, viewport);
    }}>Toggle Invert</button
  >
  <button
    id="interpolation"
    class="btn"
    on:click={function (e) {
      const viewport = cornerstone.getViewport(element);
      if (!viewport) return;

      viewport.pixelReplication = !viewport.pixelReplication;
      renderingEngine.setViewport(element, viewport);
    }}>Toggle Interpolation</button
  >
  <button
    id="hflip"
    class="btn"
    on:click={function (e) {
      const viewport = cornerstone.getViewport(element);
      if (!viewport) return;

      viewport.hflip = !viewport.hflip;
      renderingEngine.setViewport(element, viewport);
    }}>Horizontal Flip</button
  >
  <button
    id="vflip"
    class="btn"
    on:click={function (e) {
      const viewport = cornerstone.getViewport(element);
      if (!viewport) return;

      viewport.vflip = !viewport.vflip;
      renderingEngine.setViewport(element, viewport);
    }}>Vertical Flip</button
  >
  <button
    id="rotate"
    class="btn"
    on:click={function (e) {
      const viewport = cornerstone.getViewport(element);
      if (!viewport) return;

      viewport.rotation += 90;
      renderingEngine.setViewport(element, viewport);
    }}>Rotate 90</button
  >

  <br />
  <br />

  <div
    id="dicomImageWrapper"
    style="width:512px;height:512px;position:relative;color:white"
    on:contextmenu={() => false}
    on:mousedown={() => false}
  >
    <div
      bind:this={element}
      id="dicomImage"
      style="width:512px;height:512px;top:0px;left:0px;position:absolute"
      on:mousemove={function (event) {
        const pixelCoords = renderingEngine.pageToPixel(element, event.pageX, event.pageY);
        coords =
          'pageX=' +
          event.pageX +
          ', pageY=' +
          event.pageY +
          ', pixelX=' +
          pixelCoords.x +
          ', pixelY=' +
          pixelCoords.y;
      }}
      on:wheel|stopPropagation|preventDefault={function (e) {
        if (e.deltaY > 0) {
          if (currentImageIndex === 0) {
            updateTheImage(1);
          }
        } else {
          if (currentImageIndex === 1) {
            updateTheImage(0);
          }
        }
      }}
      on:mousedown={function (e) {
        lastX = e.pageX;
        lastY = e.pageY;
        mouseButton = e.button;
        console.log(e);

        enable_mouse_move = true;
      }}
      on:mouseup={function mouseUpHandler() {
        enable_mouse_move = false;
      }}
      on:mousemove={function (e) {
        if (!enable_mouse_move) return;
        const deltaX = e.pageX - lastX;
        const deltaY = e.pageY - lastY;
        lastX = e.pageX;
        lastY = e.pageY;
        let viewport = cornerstone.getViewport(element);
        if (!viewport) return;
        if (mouseButton === 0) {
          viewport.voi.windowWidth += deltaX / viewport.scale;
          viewport.voi.windowCenter += deltaY / viewport.scale;
          renderingEngine.setViewport(element, viewport);
        } else if (mouseButton === 2) {
          viewport.translation.x += deltaX / viewport.scale;
          viewport.translation.y += deltaY / viewport.scale;
          renderingEngine.setViewport(element, viewport);
        } else if (mouseButton === 1) {
          viewport.scale += deltaY / 100;
          renderingEngine.setViewport(element, viewport);
        }
      }}
    >
      <canvas
        class="cornerstone-canvas"
        style="display: block; width: 512px; height: 512px;"
        width="512"
        height="512"
      />
    </div>

    <div id="topleft" class="overlay" style="position:absolute;top:0px;left:0px">{topleft}</div>
    <div id="topright" class="overlay" style="position:absolute;top:0px;right:0px">
      {topright}
    </div>
    <div id="bottomright" class="overlay" style="position:absolute;bottom:0px;right:0px">
      {bottomright}
    </div>
    <div id="bottomleft" class="overlay" style="position:absolute;bottom:0px;left:0px">
      {bottomleft}
    </div>
  </div>

  <div>
    <span id="coords">{coords}</span>
  </div>
</div>
