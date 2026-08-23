import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// A real photographed environment — reflections on glossy/metal parts are
// literally a picture of this, so its own detail/brightness/contrast is
// what makes them look real rather than a flat, empty-looking gradient.
// Bright and warm rather than the moody underpass tried earlier — same
// three.js-bundled asset set (examples/textures/equirectangular), used in
// their own PBR material showcase demos for exactly this reason.
const HDRI_PATH = "/hdri/venice_sunset_1k.hdr";

// Generating the PMREM (prefiltered mipmapped env map three actually
// samples for reflections) from that image costs real time — decoding a
// 1k HDR plus several GPU convolution passes. Items get switched a lot
// (every arrow key press remounts a fresh viewer), so this is done once
// per page session and cached/reused by every viewer after the first,
// instead of repeating the load + generate on every single item switch.
let sharedEnvTexture = null;
let sharedEnvPromise = null;
function getSharedEnvironment(renderer) {
  if (sharedEnvTexture) return Promise.resolve(sharedEnvTexture);
  if (!sharedEnvPromise) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    sharedEnvPromise = new RGBELoader().loadAsync(HDRI_PATH).then((hdrTexture) => {
      sharedEnvTexture = pmrem.fromEquirectangular(hdrTexture).texture;
      hdrTexture.dispose();
      pmrem.dispose();
      return sharedEnvTexture;
    });
  }
  return sharedEnvPromise;
}

// Some exported .glb files (anything run through Draco compression to
// shrink file size — Blender's glTF exporter offers this as a checkbox)
// need a separate decoder to even parse, not just render — GLTFLoader
// throws on them without one attached. The decoder files themselves are
// copied from three's own package into /public/draco/ (see that folder's
// origin: node_modules/three/examples/jsm/libs/draco/gltf/) so this stays
// a same-origin asset instead of depending on a CDN.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

// Mounts a small self-contained Three.js viewer into `container`.
// Loads `modelPath` (a .glb) if provided; otherwise (or on load failure)
// falls back to a simple rotating placeholder so the page never looks
// broken while you're still producing real models.
//
// `fitMargin` (optional) overrides the default framing tightness for
// this one model — see the comment above the default further down. Set
// it per item (from items.js) rather than globally: a compact/round mesh
// can safely go tighter than a mesh with long/thin extents (a packaging
// box, a slide) without clipping on rotation, and there's no one value
// that's both big and safe for every shape at once.
//
// `startOpposite` (optional) flips the starting camera angle to the far
// side of the model instead of the shared default corner — per item, same
// reasoning as fitMargin: some models just look better greeting you from
// their other side, without changing that default for every other item.
//
// `startAngle` (optional) — { thetaDeg, phiDeg } — sets an exact starting
// camera angle, overriding startOpposite/the shared default entirely.
// Read these two numbers straight off the on-screen coordinate readout
// (see SHOW_ANGLE_READOUT below): drag to the angle you want, screenshot
// it, and the θ/φ shown is exactly what goes here.
//
// Returns a `dispose()` function — call it when the viewer is removed
// from the DOM (e.g. closing the item modal) to free GPU resources.

// TEMP — an on-screen "θ 132.4°  φ 58.1°" readout in the corner of every
// viewer, live-updating while you drag, so you can find and report an
// exact starting angle instead of eyeballing "opposite-ish". Flip this
// back to false (or delete the block below marked TEMP) once you've
// picked your angles and don't need it anymore.
const SHOW_ANGLE_READOUT = true;

// `animationRange` (optional) — { startFrame, endFrame, fps } — plays only
// this slice of the model's baked animation instead of the whole clip.
// Figure out `fps` from the source: check the spacing between consecutive
// keyframe times in the .glb (a uniform delta of 1/24s = 24fps, 1/30s =
// 30fps, etc) — don't guess, since trimming with the wrong fps plays the
// wrong slice.
export function mountModelViewer(container, modelPath, fitMargin, startOpposite, startAngle, animationRange) {
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 340;

  const scene = new THREE.Scene();
  // A narrow FOV ("telephoto") rather than a true OrthographicCamera —
  // much less perspective distortion/foreshortening than the old 40°
  // wide-angle look, without having to duplicate the whole zoom/framing
  // math for a second camera type. fitCameraToSphere below pushes the
  // camera back proportionally further to compensate, so the subject's
  // size-in-frame (set by `margin` there) is unaffected by this change.
  const camera = new THREE.PerspectiveCamera(12, width / height, 0.1, 100);
  const baseViewDir = new THREE.Vector3(2.2, 1.6, 2.6).normalize();
  let defaultViewDir = startOpposite ? baseViewDir.clone().multiplyScalar(-1) : baseViewDir;
  if (startAngle) {
    defaultViewDir = new THREE.Vector3().setFromSphericalCoords(
      1,
      THREE.MathUtils.degToRad(startAngle.phiDeg),
      THREE.MathUtils.degToRad(startAngle.thetaDeg)
    );
  }
  camera.position.copy(defaultViewDir);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  // Zoom is locked (see fitCameraToSphere) — free scroll-to-zoom let the
  // model get scrolled in far enough to spill outside the viewer's frame
  // and look clipped. Rotate-only avoids that entirely while still
  // feeling interactive.
  controls.enableZoom = false;

  // TEMP — see SHOW_ANGLE_READOUT above.
  let angleReadout = null;
  if (SHOW_ANGLE_READOUT) {
    angleReadout = document.createElement("div");
    angleReadout.style.cssText = [
      "position:absolute",
      "top:6px",
      "left:6px",
      "padding:3px 7px",
      "background:rgba(0,0,0,0.65)",
      "color:#7CFC9A",
      "font-family:monospace",
      "font-size:11px",
      "line-height:1.4",
      "border-radius:4px",
      "pointer-events:none",
      "z-index:5",
      "white-space:pre",
    ].join(";");
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.appendChild(angleReadout);
    const updateReadout = () => {
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      const thetaDeg = THREE.MathUtils.radToDeg(spherical.theta);
      const phiDeg = THREE.MathUtils.radToDeg(spherical.phi);
      // theta wraps to [-180, 180] from Spherical — normalize to [0, 360)
      // to match what startAngle above expects.
      const thetaNorm = ((thetaDeg % 360) + 360) % 360;
      angleReadout.textContent = `θ ${thetaNorm.toFixed(1)}°  φ ${phiDeg.toFixed(1)}°`;
    };
    controls.addEventListener("change", updateReadout);
    updateReadout();
  }

  let disposed = false;
  getSharedEnvironment(renderer).then((envTexture) => {
    // First-ever viewer this session briefly renders without it while the
    // HDRI streams in (direct lights below still light things reasonably
    // in the meantime) — every mount after that hits the cache and this
    // resolves instantly. Guard against setting it after this instance
    // was already torn down (switched away before the load finished).
    if (!disposed) scene.environment = envTexture;
  });

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const key = new THREE.DirectionalLight(0xfff3e0, 2.5);
  key.position.set(3, 5, 4);
  // Casts the actual contact shadow below (see shadowCatcher) — a real
  // cast shadow does more for "does this look real" than the environment
  // map alone; it's what grounds the model instead of it looking like it
  // floats. Every model gets normalized to the same ~2.4-unit box (see
  // frameSubject/targetSize below), so a fixed frustum this size covers
  // all of them without per-item tuning.
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -2.5;
  key.shadow.camera.right = 2.5;
  key.shadow.camera.top = 2.5;
  key.shadow.camera.bottom = -2.5;
  key.shadow.bias = -0.0015;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  scene.add(key.target);
  const rim = new THREE.DirectionalLight(0x9fb8ff, 0.85);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  // Only shows where something's actually in shadow (ShadowMaterial is
  // fully transparent everywhere else) — gives the model a soft contact
  // shadow to sit on, without a fully modeled floor that would otherwise
  // show through/clash with the page's own blurred background behind the
  // transparent canvas.
  const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.35 }));
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  let subject = null;
  let boundingSphere = null;
  // Some models carry their own baked animation (a moving ribbon, a lid
  // popping open, etc) — mixer stays null for
  // models/placeholders that don't have one, so update() below is a no-op.
  let mixer = null;
  const clock = new THREE.Clock();

  // Points the camera at a distance where the subject's bounding sphere
  // fills the frame at a set ratio, for the current camera aspect — then
  // locks min/maxDistance there so it can never be zoomed past that
  // point. Called once after a model loads (subject not yet rotated, so
  // it also sets the starting angle), and again on resize (min/maxDistance
  // change re-clamps the *existing* camera position via OrbitControls, so
  // the user's current rotation is preserved — see onResize below).
  function fitCameraToSphere(resetAngle) {
    if (!boundingSphere) return;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    // 1.0 = the subject's bounding sphere exactly touches the frame edges
    // from every rotation angle — this is the actual size-in-frame lever
    // (the object's own scale/targetSize below cancels out of this math,
    // since distance is derived from the bounding sphere itself). This is
    // also the hard safety floor for any mesh, shape unknown: going below
    // 1.0 only stays uncropped for roughly ball-shaped meshes — anything
    // more elongated (a long packaging box, a slide) swings its corners
    // past the sphere's own silhouette and out of frame on rotation. Callers
    // that know their specific mesh is compact/round can pass a lower
    // fitMargin for a tighter default fill; unset defaults to this safe floor.
    const margin = fitMargin ?? 1.03;
    const distance = (boundingSphere.radius / Math.sin(Math.min(vFov, hFov) / 2)) * margin;

    if (resetAngle) {
      camera.position.copy(defaultViewDir).multiplyScalar(distance);
    }
    camera.near = Math.max(distance / 100, 0.01);
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    controls.minDistance = distance;
    controls.maxDistance = distance;
    controls.update();
  }

  function frameSubject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Just normalizes different models' wildly different export scales to
    // one working size — how much of the frame the subject actually fills
    // is controlled by `margin` in fitCameraToSphere above, not this value.
    const targetSize = 2.4;
    const scale = targetSize / maxDim;
    object.scale.setScalar(scale);

    const newBox = new THREE.Box3().setFromObject(object);
    const newCenter = newBox.getCenter(new THREE.Vector3());
    object.position.sub(newCenter);

    const finalBox = new THREE.Box3().setFromObject(object);
    const sphere = new THREE.Sphere();
    finalBox.getBoundingSphere(sphere);
    boundingSphere = sphere;

    // Sit the shadow catcher right at the model's own base (a hair below,
    // so the shadow doesn't z-fight with the model's bottom faces) —
    // recomputed per model since they're not all the same height within
    // their normalized bounding box.
    shadowCatcher.position.y = finalBox.min.y - 0.002;

    controls.target.set(0, 0, 0);
    fitCameraToSphere(true);
  }

  function addPlaceholder() {
    const geo = new THREE.IcosahedronGeometry(0.9, 0);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x8a7b5c,
      roughness: 0.35,
      metalness: 0.25,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
    });
    subject = new THREE.Mesh(geo, mat);
    subject.castShadow = true;
    scene.add(subject);
    frameSubject(subject);
  }

  if (modelPath) {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      modelPath,
      (gltf) => {
        subject = gltf.scene;
        // Loaded models open facing the same way they were exported,
        // which for this asset put its back toward the camera/key light
        // on load — spin it 180° so the lit front is what greets you.
        subject.rotation.y = Math.PI;
        scene.add(subject);

        // GLTFLoader leaves texture anisotropy at its default (1) — fine
        // head-on, but map detail smears at the grazing angles this
        // orbit viewer spends most of its time at. Maxing it out per the
        // GPU's actual cap is a free sharpness win, no quality tradeoff.
        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        subject.traverse((node) => {
          if (!node.isMesh || !node.material) return;
          node.castShadow = true;
          node.receiveShadow = true;
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach((mat) => {
            ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "emissiveMap"].forEach((key) => {
              if (mat[key]) mat[key].anisotropy = maxAnisotropy;
            });
          });
        });

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(subject);
          gltf.animations.forEach((clip) => {
            const playClip = animationRange
              ? THREE.AnimationUtils.subclip(
                  clip,
                  `${clip.name}-trim`,
                  animationRange.startFrame,
                  animationRange.endFrame,
                  animationRange.fps ?? 30
                )
              : clip;
            mixer.clipAction(playClip).play();
          });
          // Force the pose forward to whatever the (possibly trimmed) clip
          // actually starts on *before* framing/centering below. Without
          // this, frameSubject measures the untouched bind pose (e.g. the
          // packaging box fully closed), then the animation immediately
          // jumps to its real starting frame (e.g. already mid-opening) —
          // the model's visual centroid shifts after that jump, but the
          // rotation pivot stays locked to the stale bind-pose center, so
          // it visibly spins off-axis instead of around its own middle.
          mixer.update(0);
        }

        frameSubject(subject);
      },
      undefined,
      () => {
        // model missing/failed to load — fall back quietly
        addPlaceholder();
      }
    );
  } else {
    addPlaceholder();
  }

  let raf = null;
  function animate() {
    raf = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    // No auto-rotate — the model sits still until dragged, rather than
    // spinning on its own on load.
    if (mixer) mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    // Re-clamp the zoom-locked distance for the new aspect without
    // resetting the camera's current orbit angle.
    fitCameraToSphere(false);
    renderer.setSize(w, h);
  }
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);

  function dispose() {
    disposed = true;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    if (mixer) mixer.stopAllAction();
    controls.dispose();
    // The environment texture is shared/cached across every viewer (see
    // getSharedEnvironment) — never dispose it here, only this instance's
    // own renderer/scene resources.
    renderer.dispose();
    if (angleReadout && angleReadout.parentNode) {
      angleReadout.parentNode.removeChild(angleReadout);
    }
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m.dispose());
      }
    });
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  return dispose;
}
