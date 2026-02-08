import { cn } from "@/lib/utils";

export default function SectionHeading({
  title,
  subtitle,
  center = false,
  className,
  subtitleClassName,
}) {
  return (
    <div className={cn("relative", center && "text-center", className)}>
      <h2 className="poppins-text text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-white leading-tight">
        {title}
        {/* <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80 rounded-full"></span>
        <span className="absolute -bottom-1 left-2 w-3/4 h-1 bg-gradient-to-r from-amber-300 to-orange-300 opacity-60 rounded-full"></span> */}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "nunito-text mt-6 max-w-3xl text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light",
            center && "mx-auto",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
