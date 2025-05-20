// // components/landing/EVChargingScene.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { gsap } from "gsap";

// const EVChargingScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const animationFrameRef = useRef<number>(0);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Initialize scene
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     scene.background = new THREE.Color(0xf1f5f9); // Light background that matches the design

//     // Camera setup
//     const camera = new THREE.PerspectiveCamera(
//       40,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(5, 3, 8);

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     rendererRef.current = renderer;
//     renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     containerRef.current.appendChild(renderer.domElement);

//     // Orbit controls for testing (can be removed in production)
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.enableZoom = false;
//     controls.enablePan = false;
//     controls.minPolarAngle = Math.PI / 4; // Restrict vertical rotation
//     controls.maxPolarAngle = Math.PI / 2.5;
//     controls.autoRotate = true;
//     controls.autoRotateSpeed = 0.5;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     const fillLight = new THREE.DirectionalLight(0x8ecef7, 0.3);
//     fillLight.position.set(-5, 3, -5);
//     scene.add(fillLight);

//     // Ground (charging station platform)
//     const groundGeometry = new THREE.PlaneGeometry(20, 20);
//     const groundMaterial = new THREE.MeshStandardMaterial({ 
//       color: 0xdedede,
//       roughness: 0.8,
//     });
//     const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//     ground.rotation.x = -Math.PI / 2;
//     ground.position.y = -0.5;
//     ground.receiveShadow = true;
//     scene.add(ground);

//     // Charging station
//     const stationGeometry = new THREE.BoxGeometry(1, 2, 1);
//     const stationMaterial = new THREE.MeshStandardMaterial({ 
//       color: 0x3b82f6, // Primary color from your site
//     });
//     const chargingStation = new THREE.Mesh(stationGeometry, stationMaterial);
//     chargingStation.position.set(0, 0.5, 0);
//     chargingStation.castShadow = true;
//     chargingStation.receiveShadow = true;
//     scene.add(chargingStation);

//     // Charging cable (simplified)
//     const cablePoints = [];
//     cablePoints.push(new THREE.Vector3(0.4, 1, 0));
//     cablePoints.push(new THREE.Vector3(1, 0.8, 0));
//     cablePoints.push(new THREE.Vector3(1.5, 0.7, 0));
//     cablePoints.push(new THREE.Vector3(2, 0.6, 0));

//     const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
//     const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.05, 8, false);
//     const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
//     const cable = new THREE.Mesh(cableGeometry, cableMaterial);
//     cable.castShadow = true;
//     scene.add(cable);

//     // Car 1 (already charging)
//     const car1Geometry = new THREE.BoxGeometry(2.2, 0.8, 1);
//     const car1Material = new THREE.MeshStandardMaterial({ color: 0x64748b });
//     const car1 = new THREE.Mesh(car1Geometry, car1Material);
//     car1.position.set(2.5, 0, 0);
//     car1.castShadow = true;
//     car1.receiveShadow = true;
//     scene.add(car1);

//     // Car 1 details (windows, wheels)
//     const windowGeometry = new THREE.BoxGeometry(1, 0.4, 0.8);
//     const windowMaterial = new THREE.MeshStandardMaterial({ 
//       color: 0x94a3b8,
//       transparent: true,
//       opacity: 0.7,
//     });
//     const car1Window = new THREE.Mesh(windowGeometry, windowMaterial);
//     car1Window.position.set(2.5, 0.6, 0);
//     car1.add(car1Window);

//     // Wheels
//     const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
//     const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
//     const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     wheel1.rotation.z = Math.PI / 2;
//     wheel1.position.set(1.8, -0.4, 0.5);
//     car1.add(wheel1);
    
//     const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     wheel2.rotation.z = Math.PI / 2;
//     wheel2.position.set(1.8, -0.4, -0.5);
//     car1.add(wheel2);
    
//     const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     wheel3.rotation.z = Math.PI / 2;
//     wheel3.position.set(3.2, -0.4, 0.5);
//     car1.add(wheel3);
    
//     const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     wheel4.rotation.z = Math.PI / 2;
//     wheel4.position.set(3.2, -0.4, -0.5);
//     car1.add(wheel4);

//     // Car 2 (arriving)
//     const car2Geometry = new THREE.BoxGeometry(2.2, 0.8, 1);
//     const car2Material = new THREE.MeshStandardMaterial({ color: 0xe11d48 });
//     const car2 = new THREE.Mesh(car2Geometry, car2Material);
//     car2.position.set(10, 0, 3);
//     car2.castShadow = true;
//     car2.receiveShadow = true;
//     scene.add(car2);

//     // Car 2 details (windows, wheels)
//     const car2Window = new THREE.Mesh(windowGeometry, windowMaterial);
//     car2Window.position.set(0, 0.6, 0);
//     car2.add(car2Window);

//     // Wheels for car 2
//     const car2Wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     car2Wheel1.rotation.z = Math.PI / 2;
//     car2Wheel1.position.set(-0.7, -0.4, 0.5);
//     car2.add(car2Wheel1);
    
//     const car2Wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     car2Wheel2.rotation.z = Math.PI / 2;
//     car2Wheel2.position.set(-0.7, -0.4, -0.5);
//     car2.add(car2Wheel2);
    
//     const car2Wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     car2Wheel3.rotation.z = Math.PI / 2;
//     car2Wheel3.position.set(0.7, -0.4, 0.5);
//     car2.add(car2Wheel3);
    
//     const car2Wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     car2Wheel4.rotation.z = Math.PI / 2;
//     car2Wheel4.position.set(0.7, -0.4, -0.5);
//     car2.add(car2Wheel4);

//     // Add trees/plants
//     const createTree = (x: number, z: number) => {
//       const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
//       const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
//       const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
//       trunk.position.set(x, -0.25, z);
//       trunk.castShadow = true;
//       trunk.receiveShadow = true;
//       scene.add(trunk);

//       const leavesGeometry = new THREE.SphereGeometry(0.3, 8, 8);
//       const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
//       const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
//       leaves.position.set(x, 0.2, z);
//       leaves.castShadow = true;
//       scene.add(leaves);
//     };

//     // Add some trees around the scene
//     createTree(1, 2);
//     createTree(-1, 2);
//     createTree(-2, -1);
//     createTree(4, 1);

//     // Animate car 2 arriving
//     gsap.to(car2.position, {
//       x: 5,
//       z: 0,
//       duration: 5,
//       ease: "power2.inOut",
//       delay: 2,
//       onComplete: () => {
//         // Create a charging effect when car 2 arrives
//         const chargingEffect = () => {
//           const sparkGeometry = new THREE.SphereGeometry(0.05, 8, 8);
//           const sparkMaterial = new THREE.MeshBasicMaterial({ 
//             color: 0x4ade80,
//             transparent: true, 
//             opacity: 0.8
//           });
//           const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
          
//           // Position at charging station
//           spark.position.set(
//             0.5 + Math.random() * 0.2,
//             0.5 + Math.random() * 0.5,
//             Math.random() * 0.2 - 0.1
//           );
          
//           scene.add(spark);
          
//           gsap.to(spark.position, {
//             x: car2.position.x - 0.8,
//             y: spark.position.y + Math.random() * 0.2,
//             duration: 0.8,
//             ease: "power1.in",
//             onComplete: () => {
//               scene.remove(spark);
//             }
//           });
          
//           gsap.to(spark.material, {
//             opacity: 0,
//             duration: 0.8
//           });
//         };
        
//         // Create periodic charging effect
//         const chargingInterval = setInterval(chargingEffect, 200);
//         setTimeout(() => clearInterval(chargingInterval), 10000);
//       }
//     });

//     // Animation loop
//     const animate = () => {
//       animationFrameRef.current = requestAnimationFrame(animate);
      
//       if (controls) controls.update();
//       if (renderer && scene && camera) {
//         renderer.render(scene, camera);
//       }
//     };
    
//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       if (!containerRef.current || !camera || !renderer) return;
      
//       camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//     };
    
//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       if (rendererRef.current && containerRef.current) {
//         containerRef.current.removeChild(rendererRef.current.domElement);
//       }
//     };
//   }, []);

//   return (
//     <div 
//       ref={containerRef} 
//       className="w-full h-full min-h-[400px] lg:min-h-[500px] rounded-xl overflow-hidden"
//       aria-label="3D animation of electric vehicles charging"
//     />
//   );
// };

// export default EVChargingScene;





"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

const EVChargingScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // References to control the charging animation
  const car1Ref = useRef<THREE.Group | null>(null);
  const car2Ref = useRef<THREE.Group | null>(null);
  const cableRef = useRef<THREE.Mesh | null>(null);
  const chargingEffectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9); // Light background that matches the design

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      40,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(5, 3, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Orbit controls for testing (can be removed in production)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 4; // Restrict vertical rotation
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x8ecef7, 0.3);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Ground (charging station platform)
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xdedede,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Charging station
    const stationGeometry = new THREE.BoxGeometry(1, 2, 1);
    const stationMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6, // Primary color
    });
    const chargingStation = new THREE.Mesh(stationGeometry, stationMaterial);
    chargingStation.position.set(0, 0.5, 0);
    chargingStation.castShadow = true;
    chargingStation.receiveShadow = true;
    scene.add(chargingStation);

    // Station details
    const screenGeometry = new THREE.PlaneGeometry(0.6, 0.4);
    const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1, 0.51);
    chargingStation.add(screen);

    // Add station logo
    const logoGeometry = new THREE.CircleGeometry(0.1, 32);
    const logoMaterial = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0.7, 0.51);
    chargingStation.add(logo);

    // Charging port
    const portGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const portMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    const port = new THREE.Mesh(portGeometry, portMaterial);
    port.rotation.x = Math.PI / 2;
    port.position.set(0.4, 0.8, 0.5);
    chargingStation.add(port);

    // Create more realistic cars
    const createCar = (color: number) => {
      const carGroup = new THREE.Group();
      
      // Car body - main part
      const bodyGeometry = new THREE.BoxGeometry(4, 0.8, 1.8);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      body.castShadow = true;
      body.receiveShadow = true;
      carGroup.add(body);
      
      // Car cabin
      const cabinGeometry = new THREE.BoxGeometry(2.2, 0.7, 1.7);
      const cabinMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        metalness: 0.1,
        roughness: 0.2,
      });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.set(-0.3, 1.15, 0);
      body.add(cabin);
      
      // Windows
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.7,
        metalness: 0.9,
        roughness: 0.1,
      });
      
      // Windshield
      const windshieldGeometry = new THREE.PlaneGeometry(1.2, 0.6);
      const windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
      windshield.rotation.x = -Math.PI / 4;
      windshield.position.set(0.6, 0.3, 0);
      cabin.add(windshield);
      
      // Rear window
      const rearWindowGeometry = new THREE.PlaneGeometry(1.1, 0.5);
      const rearWindow = new THREE.Mesh(rearWindowGeometry, windowMaterial);
      rearWindow.rotation.x = Math.PI / 4;
      rearWindow.position.set(-1.1, 0.3, 0);
      cabin.add(rearWindow);
      
      // Side windows
      const sideWindowGeometry = new THREE.PlaneGeometry(1.8, 0.5);
      const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
      leftWindow.rotation.y = Math.PI / 2;
      leftWindow.position.set(0, 0.25, 0.85);
      cabin.add(leftWindow);
      
      const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
      rightWindow.rotation.y = -Math.PI / 2;
      rightWindow.position.set(0, 0.25, -0.85);
      cabin.add(rightWindow);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32);
      const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.7,
      });
      
      const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      frontLeftWheel.rotation.z = Math.PI / 2;
      frontLeftWheel.position.set(1.3, -0.05, 0.9);
      carGroup.add(frontLeftWheel);
      
      const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      frontRightWheel.rotation.z = Math.PI / 2;
      frontRightWheel.position.set(1.3, -0.05, -0.9);
      carGroup.add(frontRightWheel);
      
      const rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      rearLeftWheel.rotation.z = Math.PI / 2;
      rearLeftWheel.position.set(-1.3, -0.05, 0.9);
      carGroup.add(rearLeftWheel);
      
      const rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      rearRightWheel.rotation.z = Math.PI / 2;
      rearRightWheel.position.set(-1.3, -0.05, -0.9);
      carGroup.add(rearRightWheel);
      
      // Wheel caps
      const wheelCapGeometry = new THREE.CircleGeometry(0.18, 16);
      const wheelCapMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
      
      const createWheelCap = (wheel: THREE.Mesh, side: number) => {
        const wheelCap = new THREE.Mesh(wheelCapGeometry, wheelCapMaterial);
        wheelCap.position.set(0, 0, side * 0.151);
        wheel.add(wheelCap);
      };
      
      createWheelCap(frontLeftWheel, -1);
      createWheelCap(frontRightWheel, 1);
      createWheelCap(rearLeftWheel, -1);
      createWheelCap(rearRightWheel, 1);
      
      // Headlights
      const headlightGeometry = new THREE.CircleGeometry(0.15, 16);
      const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffcc,
        emissiveIntensity: 0.5,
      });
      
      const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      leftHeadlight.position.set(2, 0.4, 0.6);
      leftHeadlight.rotation.y = Math.PI / 2;
      carGroup.add(leftHeadlight);
      
      const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      rightHeadlight.position.set(2, 0.4, -0.6);
      rightHeadlight.rotation.y = Math.PI / 2;
      carGroup.add(rightHeadlight);
      
      // Taillights
      const taillightGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.4);
      const taillightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
      });
      
      const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
      leftTaillight.position.set(-2, 0.5, 0.7);
      carGroup.add(leftTaillight);
      
      const rightTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
      rightTaillight.position.set(-2, 0.5, -0.7);
      carGroup.add(rightTaillight);
      
      // Charging port on the car
      const carPortGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
      const carPortMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const carPort = new THREE.Mesh(carPortGeometry, carPortMaterial);
      carPort.rotation.z = Math.PI / 2;
      carPort.position.set(-1.8, 0.5, -0.9);
      carGroup.add(carPort);
      
      return carGroup;
    };

    // Car 1 (already charging)
    const car1 = createCar(0x64748b); // Gray color
    car1.position.set(3, 0, 0.2);
    car1.rotation.y = -Math.PI / 20; // Slight angle
    scene.add(car1);
    car1Ref.current = car1;

    // Car 2 (arriving)
    const car2 = createCar(0xe11d48); // Red color
    car2.position.set(15, 0, 0.2);
    scene.add(car2);
    car2Ref.current = car2;

    // Charging cable (connected to first car)
    const createChargingCable = (startPoint: THREE.Vector3, endPoint: THREE.Vector3) => {
      const cablePoints = [];
      cablePoints.push(startPoint);
      
      // Add control points for cable curve
      const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
      midPoint.y -= 0.3; // Make the cable droop down a bit
      
      cablePoints.push(midPoint);
      cablePoints.push(endPoint);
      
      const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
      const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.04, 8, false);
      const cableMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.6,
      });
      const cable = new THREE.Mesh(cableGeometry, cableMaterial);
      cable.castShadow = true;
      
      return cable;
    };

    // Create initial cable connected to car1
    const startPoint = new THREE.Vector3(0.4, 0.8, 0.5);
    const endPoint = new THREE.Vector3(car1.position.x - 1.8, 0.5, car1.position.z - 0.7);
    const cable = createChargingCable(startPoint, endPoint);
    scene.add(cable);
    cableRef.current = cable;

    // Add trees/plants around the scene
    const createTree = (x: number, z: number, scale: number = 1) => {
      const treeGroup = new THREE.Group();
      
      const trunkGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.15 * scale, 0.8 * scale, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8b4513,
        roughness: 0.9,
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 0.4 * scale;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);

      // Multiple leaf clusters for more realistic trees
      const createLeafCluster = (x: number, y: number, z: number, size: number) => {
        const leavesGeometry = new THREE.SphereGeometry(size, 8, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x4ade80,
          roughness: 0.8,
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(x, y, z);
        leaves.castShadow = true;
        return leaves;
      };
      
      const mainLeaves = createLeafCluster(0, 1 * scale, 0, 0.5 * scale);
      treeGroup.add(mainLeaves);
      
      // Add some smaller clusters
      treeGroup.add(createLeafCluster(0.2 * scale, 0.9 * scale, 0.2 * scale, 0.3 * scale));
      treeGroup.add(createLeafCluster(-0.2 * scale, 0.85 * scale, -0.1 * scale, 0.35 * scale));
      treeGroup.add(createLeafCluster(0, 1.2 * scale, 0.1 * scale, 0.3 * scale));
      
      treeGroup.position.set(x, -0.5, z);
      scene.add(treeGroup);
    };

    // Add trees and plants around the scene
    createTree(4, 3, 1.2);
    createTree(-3, 4, 1.5);
    createTree(-4, -3, 1);
    createTree(5, -2, 1.3);
    createTree(8, 2, 0.8);
    createTree(-2, -1, 0.7);
    
    // Add some smaller bushes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 6 + Math.random() * 2;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      createTree(x, z, 0.5 + Math.random() * 0.3);
    }

    // Function to create charging effect
    const createChargingEffect = (targetCar: THREE.Mesh | THREE.Group) => {
      // Clear any existing charging effect
      if (chargingEffectIntervalRef.current) {
        clearInterval(chargingEffectIntervalRef.current);
      }
      
      // Get target position based on car position
      let targetPosition;
      if (targetCar === car1) {
        targetPosition = new THREE.Vector3(car1.position.x - 1.8, 0.5, car1.position.z - 0.7);
      } else {
        targetPosition = new THREE.Vector3(car2.position.x - 1.8, 0.5, car2.position.z - 0.7);
      }
      
      // Create charging effect
      const chargingEffect = () => {
        const sparkGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const sparkMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x4ade80,
          transparent: true, 
          opacity: 0.8
        });
        const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
        
        // Position at charging station port
        spark.position.set(
          0.4 + Math.random() * 0.1,
          0.8 + Math.random() * 0.1,
          0.5 + Math.random() * 0.1 - 0.05
        );
        
        scene.add(spark);
        
        gsap.to(spark.position, {
          x: targetPosition.x + Math.random() * 0.2 - 0.1,
          y: targetPosition.y + Math.random() * 0.2 - 0.1,
          z: targetPosition.z + Math.random() * 0.2 - 0.1,
          duration: 0.8,
          ease: "power1.in",
          onComplete: () => {
            scene.remove(spark);
          }
        });
        
        gsap.to(spark.material, {
          opacity: 0,
          duration: 0.8
        });
      };
      
      // Create periodic charging effect
      chargingEffectIntervalRef.current = setInterval(chargingEffect, 200);
    };

    // Start the initial charging effect for car1
    createChargingEffect(car1);

    // Animation sequence
    const startAnimationSequence = () => {
      // After a delay, animate the second car arriving
      gsap.to(car2.position, {
        x: 7,
        duration: 4,
        ease: "power2.inOut",
        delay: 3,
        onComplete: () => {
          // First car leaves after second car arrives
          gsap.to(car1.position, {
            x: -10,
            duration: 5,
            ease: "power1.inOut",
            onStart: () => {
              // Remove charging cable from first car
              if (cableRef.current) {
                scene.remove(cableRef.current);
              }
              
              // Clear charging effect
              if (chargingEffectIntervalRef.current) {
                clearInterval(chargingEffectIntervalRef.current);
              }
              
              // Add brake light effect
              gsap.to((car1.children[0].children[5] as THREE.Mesh).material, {
                emissiveIntensity: 1,
                duration: 0.3
              });
              gsap.to((car1.children[0].children[6] as THREE.Mesh).material, {
                emissiveIntensity: 1,
                duration: 0.3
              });
            }
          });
          
          // After first car starts leaving, second car moves to charging position
          gsap.to(car2.position, {
            x: 3,
            delay: 1.5,
            duration: 3,
            ease: "power2.inOut",
            onComplete: () => {
              // Create new charging cable for car2
              const newEndPoint = new THREE.Vector3(car2.position.x - 1.8, 0.5, car2.position.z - 0.7);
              const newCable = createChargingCable(startPoint, newEndPoint);
              scene.add(newCable);
              cableRef.current = newCable;
              
              // Start charging effect for car2
              createChargingEffect(car2);
              
              // Reset animation sequence after a delay
              setTimeout(() => {
                // Reset car1 position far away to prepare for next cycle
                car1.position.set(15, 0, 0.2);
                
                // Reset animation loop
                setTimeout(startAnimationSequence, 5000);
              }, 12000);
            }
          });
        }
      });
    };
    
    // Start the animation sequence
    startAnimationSequence();

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (controls) controls.update();
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (chargingEffectIntervalRef.current) {
        clearInterval(chargingEffectIntervalRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] lg:min-h-[500px] rounded-xl overflow-hidden"
      aria-label="3D animation of electric vehicles charging station with cars arriving and departing"
    />
  );
};

export default EVChargingScene;