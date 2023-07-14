import styled from "styled-components";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #2db384;
`;
const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  top: 100px;

  font-size: 28px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const Circle = styled(motion.div)`
  background-color: #00a5ff;
  width: 100px;
  height: 100px;

  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

function App() {
  const [clicked, setClicked] = useState(false);
  const toggleClick = () => setClicked((prev) => !prev);
  return (
    <Wrapper onClick={toggleClick}>
      <Box>
        {!clicked ? (
          <Circle layoutId="circle" style={{ borderRadius: 0 }} />
        ) : null}
      </Box>
      <Box>
        <Box>
          {clicked ? (
            <Circle layoutId="circle" style={{ borderRadius: 50, scale: 2 }} />
          ) : null}
        </Box>
      </Box>
    </Wrapper>
  );
}
export default App;
