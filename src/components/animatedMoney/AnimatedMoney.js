import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedMoney = ({ targetValue }) => {
  const [currentValue, setCurrentValue] = useState(targetValue);

  const { number } = useSpring({
    from: { number: currentValue },
    to: { number: targetValue },
    config: { duration: 500 },
    onRest: () => setCurrentValue(targetValue),
  });

  return (
    <div className="home__money">
      ${" "}
      <animated.span>
        {number.to((val) => Math.floor(val).toLocaleString("en-US"))}
      </animated.span>
    </div>
  );
};

export default AnimatedMoney;
