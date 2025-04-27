import {cn} from "../../lib/utils"
import { AnimatedGridPattern } from "../magicui/animated-grid-pattern";

const Boxes=()=> {
  return (
    <div className="relative mt-20 bg-black bottom-0 flex h-[100px] w-[100vw] items-center justify-center overflow-hidden  border-t  border-gray-800 bg-black p-20">
      <AnimatedGridPattern
        numSquares={300}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-100%] h-[300%] skew-y-12",
        )}
      />
    </div>
  );
}
export default Boxes;
