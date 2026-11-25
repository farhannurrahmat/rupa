import Image from "next/image";

export default function Photo({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px",
  fit = "cover",
  priority = false,
  zoom = false,
  natural = false,
}) {
  if (natural) {
    return (
      <div className="relative overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes={sizes}
          priority={priority}
          className={`h-auto w-full ${zoom ? "transition duration-500 group-hover:scale-105" : ""} ${className}`}
        />
      </div>
    );
  }

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