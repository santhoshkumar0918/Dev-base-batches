// components/landing/EVChargingScene.tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

const EVChargingScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number>(0);

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
      color: 0x3b82f6, // Primary color from your site
    });
    const chargingStation = new THREE.Mesh(stationGeometry, stationMaterial);
    chargingStation.position.set(0, 0.5, 0);
    chargingStation.castShadow = true;
    chargingStation.receiveShadow = true;
    scene.add(chargingStation);

    // Charging cable (simplified)
    const cablePoints = [];
    cablePoints.push(new THREE.Vector3(0.4, 1, 0));
    cablePoints.push(new THREE.Vector3(1, 0.8, 0));
    cablePoints.push(new THREE.Vector3(1.5, 0.7, 0));
    cablePoints.push(new THREE.Vector3(2, 0.6, 0));

    const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
    const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.05, 8, false);
    const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const cable = new THREE.Mesh(cableGeometry, cableMaterial);
    cable.castShadow = true;
    scene.add(cable);

    // Car 1 (already charging)
    const car1Geometry = new THREE.BoxGeometry(2.2, 0.8, 1);
    const car1Material = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const car1 = new THREE.Mesh(car1Geometry, car1Material);
    car1.position.set(2.5, 0, 0);
    car1.castShadow = true;
    car1.receiveShadow = true;
    scene.add(car1);

    // Car 1 details (windows, wheels)
    const windowGeometry = new THREE.BoxGeometry(1, 0.4, 0.8);
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.7,
    });
    const car1Window = new THREE.Mesh(windowGeometry, windowMaterial);
    car1Window.position.set(2.5, 0.6, 0);
    car1.add(car1Window);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.set(1.8, -0.4, 0.5);
    car1.add(wheel1);
    
    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.rotation.z = Math.PI / 2;
    wheel2.position.set(1.8, -0.4, -0.5);
    car1.add(wheel2);
    
    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.rotation.z = Math.PI / 2;
    wheel3.position.set(3.2, -0.4, 0.5);
    car1.add(wheel3);
    
    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel4.rotation.z = Math.PI / 2;
    wheel4.position.set(3.2, -0.4, -0.5);
    car1.add(wheel4);

    // Car 2 (arriving)
    const car2Geometry = new THREE.BoxGeometry(2.2, 0.8, 1);
    const car2Material = new THREE.MeshStandardMaterial({ color: 0xe11d48 });
    const car2 = new THREE.Mesh(car2Geometry, car2Material);
    car2.position.set(10, 0, 3);
    car2.castShadow = true;
    car2.receiveShadow = true;
    scene.add(car2);

    // Car 2 details (windows, wheels)
    const car2Window = new THREE.Mesh(windowGeometry, windowMaterial);
    car2Window.position.set(0, 0.6, 0);
    car2.add(car2Window);

    // Wheels for car 2
    const car2Wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    car2Wheel1.rotation.z = Math.PI / 2;
    car2Wheel1.position.set(-0.7, -0.4, 0.5);
    car2.add(car2Wheel1);
    
    const car2Wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    car2Wheel2.rotation.z = Math.PI / 2;
    car2Wheel2.position.set(-0.7, -0.4, -0.5);
    car2.add(car2Wheel2);
    
    const car2Wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    car2Wheel3.rotation.z = Math.PI / 2;
    car2Wheel3.position.set(0.7, -0.4, 0.5);
    car2.add(car2Wheel3);
    
    const car2Wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    car2Wheel4.rotation.z = Math.PI / 2;
    car2Wheel4.position.set(0.7, -0.4, -0.5);
    car2.add(car2Wheel4);

    // Add trees/plants
    const createTree = (x: number, z: number) => {
      const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, -0.25, z);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      scene.add(trunk);

      const leavesGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.set(x, 0.2, z);
      leaves.castShadow = true;
      scene.add(leaves);
    };

    // Add some trees around the scene
    createTree(1, 2);
    createTree(-1, 2);
    createTree(-2, -1);
    createTree(4, 1);

    // Animate car 2 arriving
    gsap.to(car2.position, {
      x: 5,
      z: 0,
      duration: 5,
      ease: "power2.inOut",
      delay: 2,
      onComplete: () => {
        // Create a charging effect when car 2 arrives
        const chargingEffect = () => {
          const sparkGeometry = new THREE.SphereGeometry(0.05, 8, 8);
          const sparkMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4ade80,
            transparent: true, 
            opacity: 0.8
          });
          const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
          
          // Position at charging station
          spark.position.set(
            0.5 + Math.random() * 0.2,
            0.5 + Math.random() * 0.5,
            Math.random() * 0.2 - 0.1
          );
          
          scene.add(spark);
          
          gsap.to(spark.position, {
            x: car2.position.x - 0.8,
            y: spark.position.y + Math.random() * 0.2,
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
        const chargingInterval = setInterval(chargingEffect, 200);
        setTimeout(() => clearInterval(chargingInterval), 10000);
      }
    });

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
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] lg:min-h-[500px] rounded-xl overflow-hidden"
      aria-label="3D animation of electric vehicles charging"
    />
  );
};

export default EVChargingScene;