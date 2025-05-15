import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Planets() {
  const planet1 = useRef<any>();
  const planet2 = useRef<any>();
  const planet3 = useRef<any>();
  useFrame(() => {
    if (planet1.current) planet1.current.rotation.y += 0.008;
    if (planet2.current) planet2.current.rotation.y += 0.004;
    if (planet3.current) planet3.current.rotation.y += 0.012;
  });
  return (
    <>
      <mesh ref={planet1} position={[-6, 2, -10]} scale={2} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4fd1c5" />
      </mesh>
      <mesh ref={planet2} position={[0, -3, -8]} scale={1.5} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f6e05e" />
      </mesh>
      <mesh ref={planet3} position={[6, 4, -12]} scale={2.5} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#805ad5" />
      </mesh>
    </>
  );
} 