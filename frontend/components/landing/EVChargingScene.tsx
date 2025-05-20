



// "use client";

// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
// import { gsap } from "gsap";

// const EVChargingScene = () => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const animationFrameRef = useRef<number>(0);
  
//   // References to control the charging animation
//   const car1Ref = useRef<THREE.Group | null>(null);
//   const car2Ref = useRef<THREE.Group | null>(null);
//   const cableRef = useRef<THREE.Mesh | null>(null);
//   const wheelsRef = useRef<THREE.Object3D[]>([]);
//   const chargingEffectIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Initialize scene
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     scene.background = new THREE.Color(0xf1f5f9); // Light background that matches the design

//     // Camera setup - Modified to better view cars from the front
//     const camera = new THREE.PerspectiveCamera(
//       45,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     // Updated camera position to view cars more from the front
//     camera.position.set(0, 3, 10);

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     rendererRef.current = renderer;
//     renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     containerRef.current.appendChild(renderer.domElement);

//     // Orbit controls - FIXED POSITION, NO ROTATION
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.enableZoom = false;
//     controls.enablePan = false;
//     controls.enableRotate = false; // Disable rotation to keep scene stable
//     controls.minPolarAngle = Math.PI / 4; // Restrict vertical rotation
//     controls.maxPolarAngle = Math.PI / 2.5;
//     controls.autoRotate = false; // Disable auto rotation

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 1024;
//     directionalLight.shadow.mapSize.height = 1024;
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

//     // Charging station - moved to the right side of the scene
//     const stationGeometry = new THREE.BoxGeometry(1, 2, 1);
//     const stationMaterial = new THREE.MeshStandardMaterial({ 
//       color: 0x3b82f6, // Primary color
//     });
//     const chargingStation = new THREE.Mesh(stationGeometry, stationMaterial);
//     chargingStation.position.set(3, 0.5, 0); // Moved to the right
//     chargingStation.castShadow = true;
//     chargingStation.receiveShadow = true;
//     scene.add(chargingStation);

//     // Station details
//     const screenGeometry = new THREE.PlaneGeometry(0.6, 0.4);
//     const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x111827 });
//     const screen = new THREE.Mesh(screenGeometry, screenMaterial);
//     screen.position.set(0, 1, 0.51);
//     chargingStation.add(screen);

//     // Add station logo
//     const logoGeometry = new THREE.CircleGeometry(0.1, 32);
//     const logoMaterial = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
//     const logo = new THREE.Mesh(logoGeometry, logoMaterial);
//     logo.position.set(0, 0.7, 0.51);
//     chargingStation.add(logo);

//     // Charging port
//     const portGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
//     const portMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
//     const port = new THREE.Mesh(portGeometry, portMaterial);
//     port.rotation.x = Math.PI / 2;
//     port.position.set(0.4, 0.8, 0.5);
//     chargingStation.add(port);

//     // Create Ferrari car model from the Three.js example
//     interface FerrariCarResult {
//         carGroup: THREE.Group;
//         wheels: THREE.Object3D[];
//     }

//     const createFerrariCar = (color: number): FerrariCarResult => {
//         const carGroup = new THREE.Group();
//         const wheels: THREE.Object3D[] = [];
        
//         // These materials will be applied to the Ferrari model
//         const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
//             color: color, 
//             metalness: 1.0, 
//             roughness: 0.5, 
//             clearcoat: 1.0, 
//             clearcoatRoughness: 0.03 
//         });

//         const detailsMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0xffffff, 
//             metalness: 1.0, 
//             roughness: 0.5 
//         });

//         const glassMaterial = new THREE.MeshPhysicalMaterial({ 
//             color: 0xffffff, 
//             metalness: 0.25, 
//             roughness: 0, 
//             transmission: 1.0 
//         });

//         // Create loading manager
//         const loadingManager = new THREE.LoadingManager();
        
//         // Setup DRACO loader for compressed models
//         const dracoLoader = new DRACOLoader(loadingManager);
//         dracoLoader.setDecoderPath('/draco/'); // Update this path to where your draco files are stored

//         // Setup GLTF loader
//         const loader = new GLTFLoader(loadingManager);
//         loader.setDRACOLoader(dracoLoader);

//         // Load shadow texture - Use a consistent path
//         const textureLoader = new THREE.TextureLoader();
//         let shadow: THREE.Texture;
        
//         try {
//             shadow = textureLoader.load('/models/ferrari_ao.png');
//         } catch (e) {
//             console.error("Error loading shadow texture:", e);
//             // Create a fallback shadow texture
//             const canvas = document.createElement('canvas');
//             canvas.width = 512;
//             canvas.height = 512;
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
//                 ctx.fillRect(0, 0, canvas.width, canvas.height);
//             }
//             shadow = new THREE.CanvasTexture(canvas);
//         }
        
//         // Load Ferrari model - Path must match where your model is stored
//         loader.load(
//             '/models/ferrari.glb',
//             (gltf: THREE.GLTF) => {
//                 const carModel = gltf.scene.children[0] as THREE.Object3D;
                
//                 // Apply materials
//                 const body = carModel.getObjectByName('body') as THREE.Mesh | undefined;
//                 if (body) {
//                     body.material = bodyMaterial;
//                 }

//                 // Apply materials to rims and trim
//                 ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim'].forEach(partName => {
//                     const part = carModel.getObjectByName(partName) as THREE.Mesh | undefined;
//                     if (part) {
//                         part.material = detailsMaterial;
//                     }
//                 });

//                 // Apply glass material
//                 const glass = carModel.getObjectByName('glass') as THREE.Mesh | undefined;
//                 if (glass) {
//                     glass.material = glassMaterial;
//                 }

//                 // Store wheel references for animation
//                 ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].forEach(wheelName => {
//                     const wheel = carModel.getObjectByName(wheelName);
//                     if (wheel) {
//                         wheels.push(wheel);
//                         wheelsRef.current.push(wheel);
//                     }
//                 });

//                 // Add shadow plane
//                 try {
//                     const mesh = new THREE.Mesh(
//                         new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
//                         new THREE.MeshBasicMaterial({
//                             map: shadow, 
//                             blending: THREE.MultiplyBlending, 
//                             toneMapped: false, 
//                             transparent: true
//                         })
//                     );
//                     mesh.rotation.x = -Math.PI / 2;
//                     mesh.renderOrder = 2;
//                     carModel.add(mesh);
//                 } catch (error) {
//                     console.error("Error adding shadow to car:", error);
//                 }

//                 // Add charging port to the car - moved to the side for better connection
//                 const carPortGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
//                 const carPortMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
//                 const carPort = new THREE.Mesh(carPortGeometry, carPortMaterial);
//                 carPort.rotation.z = Math.PI / 2;
//                 carPort.position.set(-0.9, 0.5, -1.8); // Moved to side of car
//                 carModel.add(carPort);

//                 // Scale down the model to fit the scene
//                 carModel.scale.set(0.7, 0.7, 0.7);
                
//                 carGroup.add(carModel);
//             }, 
//             undefined, 
//             (err: unknown) => {
//                 console.error("Error loading Ferrari model:", err);
                
//                 // Fallback to a simple car if model loading fails
//                 const simpleCarBody = new THREE.BoxGeometry(4, 1, 2);
//                 const simpleCarMaterial = new THREE.MeshPhysicalMaterial({
//                     color: color,
//                     metalness: 0.7,
//                     roughness: 0.5
//                 });
//                 const simpleCar = new THREE.Mesh(simpleCarBody, simpleCarMaterial);
//                 carGroup.add(simpleCar);
                
//                 // Add a charging port to the fallback car
//                 const carPortGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
//                 const carPortMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
//                 const carPort = new THREE.Mesh(carPortGeometry, carPortMaterial);
//                 carPort.rotation.z = Math.PI / 2;
//                 carPort.position.set(-0.9, 0.5, -1.8);
//                 carGroup.add(carPort);
//             }
//         );
        
//         return { carGroup, wheels };
//     };

//     // Car 1 (already charging) - positioned to face more toward the camera
//     const car1Result = createFerrariCar(0x64748b); // Gray color
//     const car1 = car1Result.carGroup;
//     // Changed positioning to show car more from the front
//     car1.position.set(0, 0, 2);
//     car1.rotation.y = Math.PI / 2; // Rotated to face camera/front
//     scene.add(car1);
//     car1Ref.current = car1;

//     // Car 2 (arriving) - will come from behind the camera
//     const car2Result = createFerrariCar(0xe11d48); // Red color
//     const car2 = car2Result.carGroup;
//     // Car 2 starts off-screen and will come in from the back
//     car2.position.set(0, 0, 15);
//     car2.rotation.y = Math.PI / 2; // Rotated to face front
//     scene.add(car2);
//     car2Ref.current = car2;

//     // Charging cable (connected to first car)
//     const createChargingCable = (startPoint, endPoint) => {
//       const cablePoints = [];
//       cablePoints.push(startPoint);
      
//       // Add control points for cable curve
//       const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
//       midPoint.y -= 0.3; // Make the cable droop down a bit
      
//       cablePoints.push(midPoint);
//       cablePoints.push(endPoint);
      
//       const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
//       const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.04, 8, false);
//       const cableMaterial = new THREE.MeshStandardMaterial({ 
//         color: 0x000000,
//         roughness: 0.6,
//       });
//       const cable = new THREE.Mesh(cableGeometry, cableMaterial);
//       cable.castShadow = true;
      
//       return cable;
//     };

//     // Create initial cable connected to car1 - updated coordinates
//     const startPoint = new THREE.Vector3(
//       chargingStation.position.x + 0.4, 
//       chargingStation.position.y + 0.8, 
//       chargingStation.position.z + 0.5
//     );
//     const endPoint = new THREE.Vector3(
//       car1.position.x - 0.9, 
//       car1.position.y + 0.5, 
//       car1.position.z - 1.8
//     );
//     const cable = createChargingCable(startPoint, endPoint);
//     scene.add(cable);
//     cableRef.current = cable;

//     // Enhanced function to create more realistic charging effect
//     const createChargingEffect = (targetCar) => {
//       // Clear any existing charging effect
//       if (chargingEffectIntervalRef.current) {
//         clearInterval(chargingEffectIntervalRef.current);
//       }
      
//       // Get target position based on car position
//       let targetPosition;
//       if (targetCar === car1) {
//         // Updated port position for car1
//         targetPosition = new THREE.Vector3(
//           car1.position.x - 0.9,
//           car1.position.y + 0.5,
//           car1.position.z - 1.8
//         );
//       } else {
//         // Updated port position for car2
//         targetPosition = new THREE.Vector3(
//           car2.position.x - 0.9,
//           car2.position.y + 0.5,
//           car2.position.z - 1.8
//         );
//       }
      
//       // Create enhanced charging effect with particles
//       const chargingEffect = () => {
//         // Create multiple sparks for a more dramatic effect
//         for (let i = 0; i < 3; i++) {
//           const sparkGeometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.03, 8, 8);
//           const sparkMaterial = new THREE.MeshBasicMaterial({ 
//             color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.5),
//             transparent: true, 
//             opacity: 0.8
//           });
//           const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
          
//           // Position at charging station port with some randomness
//           spark.position.set(
//             startPoint.x + Math.random() * 0.1 - 0.05,
//             startPoint.y + Math.random() * 0.1 - 0.05,
//             startPoint.z + Math.random() * 0.1 - 0.05
//           );
          
//           scene.add(spark);
          
//           // Animate the spark traveling along the cable
//           gsap.to(spark.position, {
//             x: targetPosition.x + Math.random() * 0.2 - 0.1,
//             y: targetPosition.y + Math.random() * 0.2 - 0.1,
//             z: targetPosition.z + Math.random() * 0.2 - 0.1,
//             duration: 0.5 + Math.random() * 0.5,
//             ease: "power1.in",
//             onComplete: () => {
//               // Create small flash of light at the end point
//               const flashGeometry = new THREE.SphereGeometry(0.08, 8, 8);
//               const flashMaterial = new THREE.MeshBasicMaterial({
//                 color: 0x4ade80,
//                 transparent: true,
//                 opacity: 0.7
//               });
//               const flash = new THREE.Mesh(flashGeometry, flashMaterial);
//               flash.position.copy(spark.position);
//               scene.add(flash);
              
//               // Animate the flash
//               gsap.to(flash.scale, {
//                 x: 0.1,
//                 y: 0.1, 
//                 z: 0.1,
//                 duration: 0.3,
//               });
              
//               gsap.to(flash.material, {
//                 opacity: 0,
//                 duration: 0.3,
//                 onComplete: () => {
//                   scene.remove(flash);
//                 }
//               });
              
//               scene.remove(spark);
//             }
//           });
          
//           gsap.to(spark.material, {
//             opacity: Math.random() * 0.5 + 0.5,
//             duration: 0.3,
//             yoyo: true,
//             repeat: 1
//           });
//         }
//       };
      
//       // Create periodic charging effect at a faster rate for more realism
//       chargingEffectIntervalRef.current = setInterval(chargingEffect, 100);
//     };

//     // Start the initial charging effect for car1
//     createChargingEffect(car1);

//     // Animation sequence with more realistic car movement - modified for frontal view
// // Animation sequence with side movement for cars
// const startAnimationSequence = () => {
//   // After a delay, animate the second car arriving from the side
//   gsap.to(car2.position, {
//     x: 6, // Start position far to the right side
//     z: 10, // Start position behind and to the right
//     duration: 0, // Immediately set starting position
//     onComplete: () => {
//       // Car 2 arrives from the side (right side of screen)
//       gsap.to(car2.position, {
//         x: 0, // Move to center on x-axis
//         z: 4, // Move forward on z-axis
//         duration: 4,
//         ease: "power2.inOut",
//         delay: 3,
//         onStart: () => {
//           // Make the wheels spin while the car is moving
//           gsap.to({}, {
//             duration: 4,
//             onUpdate: () => {
//               wheelsRef.current.forEach(wheel => {
//                 if (wheel && wheel.parent && wheel.parent.parent === car2) {
//                   wheel.rotation.x -= 0.2;
//                 }
//               });
//             }
//           });
//         },
//         onComplete: () => {
//           // First car leaves - moving to the side (left)
//           gsap.to(car1.position, {
//             x: -6, // Moves away to the left side
//             z: -5, // Moves slightly forward and to the left
//             duration: 5,
//             ease: "power1.inOut",
//             onStart: () => {
//               // Remove charging cable from first car
//               if (cableRef.current) {
//                 scene.remove(cableRef.current);
//               }
              
//               // Clear charging effect
//               if (chargingEffectIntervalRef.current) {
//                 clearInterval(chargingEffectIntervalRef.current);
//               }
              
//               // Animate wheels for car1 as it leaves
//               gsap.to({}, {
//                 duration: 5,
//                 onUpdate: () => {
//                   wheelsRef.current.forEach(wheel => {
//                     if (wheel && wheel.parent && wheel.parent.parent === car1) {
//                       wheel.rotation.x -= 0.2;
//                     }
//                   });
//                 }
//               });
//             }
//           });
          
//           // After first car starts leaving, second car moves to charging position
//           gsap.to(car2.position, {
//             z: 2, // Same position as car1 had
//             delay: 1.5,
//             duration: 3,
//             ease: "power2.inOut",
//             onStart: () => {
//               // Animate wheels for car2 as it moves to charging position
//               gsap.to({}, {
//                 duration: 3,
//                 onUpdate: () => {
//                   wheelsRef.current.forEach(wheel => {
//                     if (wheel && wheel.parent && wheel.parent.parent === car2) {
//                       wheel.rotation.x -= 0.2;
//                     }
//                   });
//                 }
//               });
//             },
//             onComplete: () => {
//               // Create new charging cable for car2
//               const newEndPoint = new THREE.Vector3(
//                 car2.position.x - 0.9,
//                 car2.position.y + 0.5,
//                 car2.position.z - 1.8
//               );
//               const newCable = createChargingCable(startPoint, newEndPoint);
//               scene.add(newCable);
//               cableRef.current = newCable;
              
//               // Start charging effect for car2
//               createChargingEffect(car2);
              
//               // Reset animation sequence after a delay
//               setTimeout(() => {
//                 // Reset car1 position to the right side to prepare for next cycle
//                 car1.position.set(6, 0, 10);
                
//                 // Reset animation loop
//                 setTimeout(startAnimationSequence, 5000);
//               }, 12000);
//             }
//           });
//         }
//       });
//     }
//   });
// };
    
//     // Start the animation sequence
//     startAnimationSequence();

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
//       if (chargingEffectIntervalRef.current) {
//         clearInterval(chargingEffectIntervalRef.current);
//       }
//       if (rendererRef.current && containerRef.current) {
//         containerRef.current.removeChild(rendererRef.current.domElement);
//       }
//     };
//   }, []);

//   return (
//     <div 
//       ref={containerRef} 
//       className="w-full h-full min-h-[500px] rounded-xl overflow-hidden"
//       aria-label="3D animation of Ferrari cars at an electric charging station with cars arriving and departing"
//     />
//   );
// };

// // Main component for the landing page
// const LandingPage = () => {
//   return (
//     <div className="w-full h-screen bg-gray-100 flex flex-col lg:flex-row">
//       {/* Left Side - Text and Button */}
//       <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16">
//         <div className="max-w-lg">
//           <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
//             EV Charging <span className="text-blue-600">Dev Portal</span>
//           </h1>
//           <p className="text-lg lg:text-xl text-gray-600 mb-8">
//             Access our comprehensive suite of APIs and development tools to integrate
//             with our next-generation EV charging infrastructure. Build innovative
//             solutions that power the future of electric mobility.
//           </p>
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 transform hover:scale-105">
//             Start Your Journey
//           </button>
//         </div>
//       </div>

//       {/* Right Side - 3D Scene */}
//       <div className="w-full lg:w-1/2 h-[500px] lg:h-full">
//         <EVChargingScene />
//       </div>
//     </div>
//   );
// };


// export default EVChargingScene;





"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { gsap } from "gsap";

const EVChargingScene = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // References to control the charging animation
  const car1Ref = useRef<THREE.Group | null>(null);
  const car2Ref = useRef<THREE.Group | null>(null);
  const cableRef = useRef<THREE.Mesh | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const chargingEffectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9); // Light background that matches the design

    // Camera setup - Modified to better view cars from the front
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    // Updated camera position to view cars more from the front
    camera.position.set(0, 3, 10);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Orbit controls - FIXED POSITION, NO ROTATION
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false; // Disable rotation to keep scene stable
    controls.minPolarAngle = Math.PI / 4; // Restrict vertical rotation
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.autoRotate = false; // Disable auto rotation

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

    // Charging station - moved to the right side of the scene
    const stationGeometry = new THREE.BoxGeometry(1, 2, 1);
    const stationMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6, // Primary color
    });
    const chargingStation = new THREE.Mesh(stationGeometry, stationMaterial);
    chargingStation.position.set(3, 0.5, 0); // Moved to the right
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

    // Create Ferrari car model from the Three.js example
    interface FerrariCarResult {
        carGroup: THREE.Group;
        wheels: THREE.Object3D[];
    }

    const createFerrariCar = (color: number): FerrariCarResult => {
        const carGroup = new THREE.Group();
        const wheels: THREE.Object3D[] = [];
        
        // These materials will be applied to the Ferrari model
        const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
            color: color, 
            metalness: 1.0, 
            roughness: 0.5, 
            clearcoat: 1.0, 
            clearcoatRoughness: 0.03 
        });

        const detailsMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            metalness: 1.0, 
            roughness: 0.5 
        });

        const glassMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff, 
            metalness: 0.25, 
            roughness: 0, 
            transmission: 1.0 
        });

        // Create loading manager
        const loadingManager = new THREE.LoadingManager();
        
        // Setup DRACO loader for compressed models
        const dracoLoader = new DRACOLoader(loadingManager);
        dracoLoader.setDecoderPath('/draco/'); // Update this path to where your draco files are stored

        // Setup GLTF loader
        const loader = new GLTFLoader(loadingManager);
        loader.setDRACOLoader(dracoLoader);

        // Load shadow texture - Use a consistent path
        const textureLoader = new THREE.TextureLoader();
        let shadow: THREE.Texture;
        
        try {
            shadow = textureLoader.load('/models/ferrari_ao.png');
        } catch (e) {
            console.error("Error loading shadow texture:", e);
            // Create a fallback shadow texture
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            shadow = new THREE.CanvasTexture(canvas);
        }
        
        // Load Ferrari model - Path must match where your model is stored
        loader.load(
            '/models/ferrari.glb',
            (gltf: THREE.GLTF) => {
                const carModel = gltf.scene.children[0] as THREE.Object3D;
                
                // Apply materials
                const body = carModel.getObjectByName('body') as THREE.Mesh | undefined;
                if (body) {
                    body.material = bodyMaterial;
                }

                // Apply materials to rims and trim
                ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim'].forEach(partName => {
                    const part = carModel.getObjectByName(partName) as THREE.Mesh | undefined;
                    if (part) {
                        part.material = detailsMaterial;
                    }
                });

                // Apply glass material
                const glass = carModel.getObjectByName('glass') as THREE.Mesh | undefined;
                if (glass) {
                    glass.material = glassMaterial;
                }

                // Store wheel references for animation
                ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].forEach(wheelName => {
                    const wheel = carModel.getObjectByName(wheelName);
                    if (wheel) {
                        wheels.push(wheel);
                        wheelsRef.current.push(wheel);
                    }
                });

                // Add shadow plane
                try {
                    const mesh = new THREE.Mesh(
                        new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
                        new THREE.MeshBasicMaterial({
                            map: shadow, 
                            blending: THREE.MultiplyBlending, 
                            toneMapped: false, 
                            transparent: true
                        })
                    );
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.renderOrder = 2;
                    carModel.add(mesh);
                } catch (error) {
                    console.error("Error adding shadow to car:", error);
                }

                // Add charging port to the car - moved to the side for better connection
                const carPortGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
                const carPortMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
                const carPort = new THREE.Mesh(carPortGeometry, carPortMaterial);
                carPort.rotation.z = Math.PI / 2;
                carPort.position.set(-0.9, 0.5, -1.8); // Moved to side of car
                carModel.add(carPort);

                // Scale down the model to fit the scene
                carModel.scale.set(0.7, 0.7, 0.7);
                
                carGroup.add(carModel);
            }, 
            undefined, 
            (err: unknown) => {
                console.error("Error loading Ferrari model:", err);
                
                // Fallback to a simple car if model loading fails
                const simpleCarBody = new THREE.BoxGeometry(4, 1, 2);
                const simpleCarMaterial = new THREE.MeshPhysicalMaterial({
                    color: color,
                    metalness: 0.7,
                    roughness: 0.5
                });
                const simpleCar = new THREE.Mesh(simpleCarBody, simpleCarMaterial);
                carGroup.add(simpleCar);
                
                // Add a charging port to the fallback car
                const carPortGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
                const carPortMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
                const carPort = new THREE.Mesh(carPortGeometry, carPortMaterial);
                carPort.rotation.z = Math.PI / 2;
                carPort.position.set(-0.9, 0.5, -1.8);
                carGroup.add(carPort);
            }
        );
        
        return { carGroup, wheels };
    };

    // Car 1 (already charging) - positioned to face more toward the camera
    const car1Result = createFerrariCar(0x64748b); // Gray color
    const car1 = car1Result.carGroup;
    // Changed positioning to show car more from the front
    car1.position.set(0, 0, 2);
    car1.rotation.y = Math.PI / 2; // Rotated to face camera/front
    scene.add(car1);
    car1Ref.current = car1;

    // Car 2 (arriving) - will come from the right side of the screen
    const car2Result = createFerrariCar(0xe11d48); // Red color
    const car2 = car2Result.carGroup;
    // Car 2 starts off-screen to the right
    car2.position.set(12, 0, 2); // Start position far to the right
    car2.rotation.y = Math.PI / 2; // Rotated to face front
    scene.add(car2);
    car2Ref.current = car2;

    // Charging cable (connected to first car)
    const createChargingCable = (startPoint, endPoint) => {
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

    // Create initial cable connected to car1 - updated coordinates
    const startPoint = new THREE.Vector3(
      chargingStation.position.x + 0.4, 
      chargingStation.position.y + 0.8, 
      chargingStation.position.z + 0.5
    );
    const endPoint = new THREE.Vector3(
      car1.position.x - 0.9, 
      car1.position.y + 0.5, 
      car1.position.z - 1.8
    );
    const cable = createChargingCable(startPoint, endPoint);
    scene.add(cable);
    cableRef.current = cable;

    // Enhanced function to create more realistic charging effect
    const createChargingEffect = (targetCar) => {
      // Clear any existing charging effect
      if (chargingEffectIntervalRef.current) {
        clearInterval(chargingEffectIntervalRef.current);
      }
      
      // Get target position based on car position
      let targetPosition;
      if (targetCar === car1) {
        // Updated port position for car1
        targetPosition = new THREE.Vector3(
          car1.position.x - 0.9,
          car1.position.y + 0.5,
          car1.position.z - 1.8
        );
      } else {
        // Updated port position for car2
        targetPosition = new THREE.Vector3(
          car2.position.x - 0.9,
          car2.position.y + 0.5,
          car2.position.z - 1.8
        );
      }
      
      // Create enhanced charging effect with particles
      const chargingEffect = () => {
        // Create multiple sparks for a more dramatic effect
        for (let i = 0; i < 3; i++) {
          const sparkGeometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.03, 8, 8);
          const sparkMaterial = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.5),
            transparent: true, 
            opacity: 0.8
          });
          const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
          
          // Position at charging station port with some randomness
          spark.position.set(
            startPoint.x + Math.random() * 0.1 - 0.05,
            startPoint.y + Math.random() * 0.1 - 0.05,
            startPoint.z + Math.random() * 0.1 - 0.05
          );
          
          scene.add(spark);
          
          // Animate the spark traveling along the cable
          gsap.to(spark.position, {
            x: targetPosition.x + Math.random() * 0.2 - 0.1,
            y: targetPosition.y + Math.random() * 0.2 - 0.1,
            z: targetPosition.z + Math.random() * 0.2 - 0.1,
            duration: 0.5 + Math.random() * 0.5,
            ease: "power1.in",
            onComplete: () => {
              // Create small flash of light at the end point
              const flashGeometry = new THREE.SphereGeometry(0.08, 8, 8);
              const flashMaterial = new THREE.MeshBasicMaterial({
                color: 0x4ade80,
                transparent: true,
                opacity: 0.7
              });
              const flash = new THREE.Mesh(flashGeometry, flashMaterial);
              flash.position.copy(spark.position);
              scene.add(flash);
              
              // Animate the flash
              gsap.to(flash.scale, {
                x: 0.1,
                y: 0.1, 
                z: 0.1,
                duration: 0.3,
              });
              
              gsap.to(flash.material, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                  scene.remove(flash);
                }
              });
              
              scene.remove(spark);
            }
          });
          
          gsap.to(spark.material, {
            opacity: Math.random() * 0.5 + 0.5,
            duration: 0.3,
            yoyo: true,
            repeat: 1
          });
        }
      };
      
      // Create periodic charging effect at a faster rate for more realism
      chargingEffectIntervalRef.current = setInterval(chargingEffect, 100);
    };

    // Start the initial charging effect for car1
    createChargingEffect(car1);

    // Animation sequence - UPDATED to move cars horizontally
    const startAnimationSequence = () => {
      // After a delay, animate the second car arriving from the right side
      gsap.to(car2.position, {
        x: 0, // Moves from right to center
        duration: 4,
        ease: "power2.inOut",
        delay: 3,
        onStart: () => {
          // Make the wheels spin while the car is moving
          gsap.to({}, {
            duration: 4,
            onUpdate: () => {
              wheelsRef.current.forEach(wheel => {
                if (wheel && wheel.parent && wheel.parent.parent === car2) {
                  wheel.rotation.x -= 0.2;
                }
              });
            }
          });
        },
        onComplete: () => {
          // First car leaves - moving completely off screen to the left
          gsap.to(car1.position, {
            x: -15, // Moves far to the left (completely off screen)
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
              
              // Animate wheels for car1 as it leaves
              gsap.to({}, {
                duration: 5,
                onUpdate: () => {
                  wheelsRef.current.forEach(wheel => {
                    if (wheel && wheel.parent && wheel.parent.parent === car1) {
                      wheel.rotation.x -= 0.2;
                    }
                  });
                }
              });
            }
          });
          
          // After first car starts leaving, second car moves to charging position
          gsap.to(car2.position, {
            x: 0, // Final position at center
            z: 2, // Adjust z position if needed
            delay: 1.5,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
              // Create new charging cable for car2
              const newEndPoint = new THREE.Vector3(
                car2.position.x - 0.9,
                car2.position.y + 0.5,
                car2.position.z - 1.8
              );
              const newCable = createChargingCable(startPoint, newEndPoint);
              scene.add(newCable);
              cableRef.current = newCable;
              
              // Start charging effect for car2
              createChargingEffect(car2);
              
              // Reset animation sequence after a delay
              setTimeout(() => {
                // Reset car1 position to the right side to prepare for next cycle
                car1.position.set(12, 0, 2);
                
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
      className="w-full h-full min-h-[500px] rounded-xl overflow-hidden"
      aria-label="3D animation of Ferrari cars at an electric charging station with cars arriving and departing"
    />
  );
};

// Main component for the landing page
const LandingPage = () => {
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Left Side - Text and Button */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16">
        <div className="max-w-lg">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            EV Charging <span className="text-blue-600">Dev Portal</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-8">
            Access our comprehensive suite of APIs and development tools to integrate
            with our next-generation EV charging infrastructure. Build innovative
            solutions that power the future of electric mobility.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 transform hover:scale-105">
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Right Side - 3D Scene */}
      <div className="w-full lg:w-1/2 h-[500px] lg:h-full">
        <EVChargingScene />
      </div>
    </div>
  );
};


export default EVChargingScene;