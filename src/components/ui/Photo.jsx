import Image from "next/image";

export default function Photo({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px",
  fit = "cover",
  priority = false,
  zoom = false,
}) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${fitClass} ${zoom ? "transition duration-500 group-hover:scale-105" : ""}`}
      />
    </div>
  );
}