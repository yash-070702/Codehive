import { cn } from "@/lib/utils";
import { AnimatedList } from "../magicui/animatedList";

let notifications = [
  {
    name: " Real-Time Q&A Platform",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "Reputation-Based System",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "Upvotes & Accepted Answers",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "Advanced Search & Filtering",
    icon: "🗞️",
    color: "#1E86FF",
  },
  {
    name: " Commenting System",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "Leaderboard for Top Users",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "Markdown Support",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "Tag-Based Categorization",
    icon: "🗞️",
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit  md:w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu bg-transparent backdrop-blur-md [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col ">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
          
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-white/60">{description}</p>
        </div>
      </div>
    </figure>
  );
};

export function UspList({ className }) {
   
  return (
    <div
      className={cn(
        "relative flex h-[400px] w-full flex-col mx-auto pr-10 overflow-hidden md:p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className=" absolute inset-x-0 bottom-0 h-1/4 "></div>
    </div>
  );
}
