import { SkeletonProps } from "./Skeleton.types";

export const Skeleton = ({ view }: SkeletonProps) => {
  return (
    <div
      className={`product-card bg-white rounded-2xl overflow-hidden border border-brown/5 shadow-sm group 
        ${view === "list" ? "flex items-center" : ""}`}
    >
      <div className="h-48 skeleton"></div>
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/4 skeleton rounded"></div>
        <div className="h-4 w-full skeleton rounded"></div>
        <div className="h-4 w-2/3 skeleton rounded"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 w-24 skeleton rounded"></div>
          <div className="h-10 w-10 skeleton rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};
