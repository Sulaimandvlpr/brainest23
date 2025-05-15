import { Canvas } from "@react-three/fiber";
// import Planets from "./Planets";
// import Brain from "./Brain";

export default function SpaceBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 18], fov: 60 }} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      {/* <Planets /> */}
      {/* <Brain position={[0, 6, -10]} /> */}
    </Canvas>
  );
} 