import { useState } from "react";
import { Overview } from "@/components/Overview";
import { Presentation } from "@/components/Presentation";
import { useReducedMotion } from "@/components/primitives";

export default function App() {
  const [presenting, setPresenting] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <div className={reduced ? "reduce-motion" : undefined}>
      <Overview onOpen={(index) => setPresenting(index)} />
      {presenting !== null ? (
        <Presentation
          key={presenting}
          initialIndex={presenting}
          onExit={() => setPresenting(null)}
        />
      ) : null}
    </div>
  );
}
