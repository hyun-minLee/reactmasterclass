import styled from "styled-components";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";

const Button = styled.button`
  color: #ff0040;
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: crimson;
`;
const Box = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  height: 200px;
  width: 250px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, 1fr);
`;

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;

  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Circle = styled(motion.div)`
  background-color: white;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const boxVariants = {
  start: {
    scale: 1,
  },
  end: (boxPosition: { x: number; y: number }) => ({
    x: boxPosition.x,
    y: boxPosition.y,
    scale: 1.2,
    transition: {
      duration: 0.3,
    },
  }),
};

function App() {
  const [id, setId] = useState<null | string>(null);
  const [clicked, setClicked] = useState(false);
  const [clickswitch, clickSetSwitch] = useState(false);
  const [color, setColor] = useState("#d358f7");
  const [hoveredBox, setHoveredBox] = useState<null | string>(null);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });

  const handleHoverStart = (boxId: string, event: MouseEvent) => {
    setHoveredBox(boxId);
    const a = event.offsetX - 125;
    const b = event.offsetY - 100;
    setBoxPosition({ x: a, y: b });
  };

  const handleHoverEnd = (boxId: string) => {
    setHoveredBox(null);
  };

  const swithON = () => {
    clickSetSwitch((prev) => !prev);
  };

  return (
    <Wrapper>
      <Grid>
        {["1", "2", "3", "4"].map((n) => (
          <Box
            variants={boxVariants}
            initial="start"
            custom={boxPosition}
            animate={hoveredBox === n ? "end" : "start"}
            onHoverStart={(event: MouseEvent) => handleHoverStart(n, event)}
            onHoverEnd={() => handleHoverEnd(n)}
            onClick={() => setId(n)}
            key={n}
            layoutId={n}
          >
            {n === "2" && <Circle layoutId="switch" />}
            {n === "3" && clickswitch === true ? (
              <Circle layoutId="switch" />
            ) : null}
          </Box>
        ))}
      </Grid>
      <AnimatePresence>
        {id ? (
          <Overlay
            onClick={() => setId(null)}
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          >
            <Box layoutId={id} style={{ width: 300, height: 200 }} />
          </Overlay>
        ) : null}
      </AnimatePresence>
      <Button onClick={swithON}>Switch</Button>
    </Wrapper>
  );
}
export default App;
