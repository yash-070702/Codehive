import React from "react";
import { cn } from "@/lib/utils";

export const ShimmerButton = React.forwardRef((
  {
    colorFrom = "#ffaa40",
    colorTo = "#9c40ff",
    shimmerSize = "0.05em",
    shimmerDuration = "3s",
    borderRadius = "100px",
    background = "rgba(0, 0, 0, 1)",
    className,
    children,
    ...props
  },
  ref,
) => {
  return (
    (<button
      style={{
        "--radius": borderRadius,
        "--speed": shimmerDuration,
        "--cut": shimmerSize,
        "--bg": background,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        position: "relative",
        zIndex: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "0.75rem 1.5rem",
        borderRadius: "var(--radius)",
        color: "white",
        background: "var(--bg)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transform: "translateZ(0)",
        transition: "transform 300ms ease-in-out"
      }}
      className={cn(
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        className
      )}
      ref={ref}
      {...props}>
      {/* Shimmer gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -30,
          overflow: "hidden",
          borderRadius: "var(--radius)",
          filter: "blur(2px)"
        }}>
        <div
          style={{
            position: "absolute",
            inset: "-100%",
            animation: `${shimmerDuration} linear infinite`,
            animationName: "spin",
            background: `conic-gradient(from 0deg, transparent 0, ${colorFrom} 10%, ${colorTo} 50%, ${colorFrom} 90%, transparent 100%)`
          }}
        />
      </div>

      {children}
      
      {/* Highlight overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--radius)",
          boxShadow: "inset 0 -8px 10px rgba(255, 255, 255, 0.12)",
          transition: "box-shadow 300ms ease-in-out"
        }}
        className="group-hover:shadow-[inset_0_-6px_10px_rgba(255,255,255,0.25)] group-active:shadow-[inset_0_-10px_10px_rgba(255,255,255,0.25)]"
      />
      
      {/* Background overlay to cut out gradient */}
      <div
        style={{
          position: "absolute",
          zIndex: -20,
          background: "var(--bg)",
          borderRadius: "var(--radius)",
          inset: "var(--cut)"
        }}
      />

      {/* Add keyframes for spin animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>)
  );
});

ShimmerButton.displayName = "ShimmerButton";