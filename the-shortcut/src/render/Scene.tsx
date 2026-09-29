import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { memo, useEffect, useRef } from "react";
import { Group } from "three";
import {
  locations,
  allObjects,
  npcLocations,
  extraSchedule,
} from "../content/world";
import { characters, type NPC } from "../content/story";
import { npcState } from "../simulation/game";
import { dispatch, snapshot } from "../simulation/store";
function Box({
  position,
  size,
  color = "#929a96",
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function Character({ who, color }: { who: "daniel" | NPC; color: string }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const s = snapshot();
    const minute = s.ticks / 1200;
    const extra = who === "maya" || who === "kevin" || who === "luis";
    const p =
      who === "daniel"
        ? s.player
        : extra
          ? minute >= 540 && minute < 551
            ? {
                x: who === "maya" ? -0.2 : who === "kevin" ? -1.4 : -2.4,
                z: 1.8,
              }
            : npcLocations[who]
          : who === "sarah" && minute >= 1035
            ? locations.exit
            : locations[npcState(s)[who]];
    ref.current!.position.set(p.x, 0, p.z);
    ref.current!.visible =
      who === "mark"
        ? npcState(s).mark !== "exit"
        : extra
          ? !["lunch", "rounds", "away"].includes(extraSchedule(who, minute))
          : true;
  });
  return (
    <group
      ref={ref}
      onClick={(e) => {
        if (who !== "daniel") {
          e.stopPropagation();
          dispatch({ type: "inspect", id: who });
        }
      }}
    >
      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.65, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.23, 0]} castShadow>
        <sphereGeometry args={[0.19, 12, 8]} />
        <meshStandardMaterial color="#c8c5b9" />
      </mesh>
    </group>
  );
}
function Camera() {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.position.set(11, 12, 17);
    camera.lookAt(0, 0, 0.1);
    if ("fov" in camera) {
      (camera as import("three").PerspectiveCamera).fov =
        size.width < size.height ? 76 : 36;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);
  return null;
}
function Target() {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const target = snapshot().target;
    ref.current!.visible = !!target;
    if (target) ref.current!.position.set(target.x, 0.015, target.z);
  });
  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.24, 24]} />
        <meshBasicMaterial color="#e3c884" />
      </mesh>
    </group>
  );
}
function Scene({ onHover }: { onHover: (s: string) => void }) {
  return (
    <Canvas
      shadows
      camera={{ position: [11, 12, 17], fov: 36 }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.setClearColor("#202729");
      }}
    >
      <Camera />
      <ambientLight intensity={1.3} />
      <directionalLight
        position={[-4, 12, 3]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          dispatch({ type: "move", point: { x: e.point.x, z: e.point.z } });
        }}
        onPointerOver={() => onHover("Walk")}
        onPointerOut={() => onHover("")}
      >
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial color="#646d69" />
      </mesh>
      <gridHelper
        args={[12, 24, "#818983", "#727a74"]}
        position={[0, 0.005, 0]}
        scale={[1, 1, 0.75]}
      />
      <Box position={[0, 1.5, -4.4]} size={[12, 3, 0.2]} color="#89928e" />
      <Box position={[-6, 1, 0]} size={[0.15, 2, 9]} color="#76817d" />
      {[-3.8, -0.5, 2.8].map((x) => (
        <Box
          key={x}
          position={[x, 1.9, -4.25]}
          size={[2.8, 1.7, 0.08]}
          color="#b3c2c1"
        />
      ))}
      {allObjects.map((o) => (
        <group
          key={o.id}
          position={[o.x, 0, o.z]}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "inspect", id: o.id });
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(`Inspect ${o.name}`);
          }}
          onPointerOut={() => onHover("")}
        >
          {o.id === "noticeboard" || o.id === "elevator" ? (
            <>
              <Box
                position={[0, 1.2, 0]}
                size={[1.35, 1.4, 0.16]}
                color="#aca793"
              />
              <Box position={[0, 0.45, 0]} size={[0.12, 0.9, 0.15]} />
            </>
          ) : (
            <>
              <Box
                position={[0, 0.7, 0]}
                size={[2.7, 0.15, 1.25]}
                color="#a6aaa0"
              />
              <Box position={[-1, 0.35, 0]} size={[0.15, 0.7, 1]} />
              <Box position={[1, 0.35, 0]} size={[0.15, 0.7, 1]} />
              <Box
                position={[0, 1.12, -0.25]}
                size={[0.9, 0.65, 0.12]}
                color="#343d3c"
              />
            </>
          )}
        </group>
      ))}
      <Box position={[-4.9, 0.45, 3.1]} size={[1, 0.9, 0.65]} color="#8e9690" />
      <Character who="daniel" color="#d6b46f" />
      {Object.entries(characters).map(([id, c]) => (
        <Character key={id} who={id as NPC} color={c.color} />
      ))}
      <Target />
    </Canvas>
  );
}
// Rendering consumes state; geometry never stores movement, schedules, or inspection rules.

export default memo(Scene);
