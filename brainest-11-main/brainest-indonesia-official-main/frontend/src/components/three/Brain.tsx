import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Brain(props: any) {
  const mesh = useRef<any>();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.rotation.x += 0.003;
    }
  });
  return (
    <mesh ref={mesh} {...props} castShadow receiveShadow>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#ffb6c1" />
    </mesh>
  );
} 