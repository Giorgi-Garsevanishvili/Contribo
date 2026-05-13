import { MapPin } from "lucide-react";
import { JSX } from "react";
import { ImAppleinc } from "react-icons/im";
import { IconType } from "react-icons/lib";
import { SiGooglemaps, SiOpenstreetmap } from "react-icons/si";

interface EventLocationDisplayProps {
  location: string | null | undefined;
}

interface MapLink {
  name: string;
  url: string;
  bgColor: string;
  hoverColor: string;
  Icon?: IconType;
}

export function EventLocationDisplay({
  location,
}: EventLocationDisplayProps): JSX.Element | null {
  if (!location) {
    return (
      <div className="flex items-center gap-2 text-gray-200">
        <MapPin size={16} />
        <p>No location set</p>
      </div>
    );
  }

  const mapLinks: MapLink[] = [
    {
      name: "Google Maps",
      url: `https://www.google.com/maps/search/${encodeURIComponent(location)}`,
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      Icon: SiGooglemaps,
    },
    {
      name: "Apple Maps",
      url: `maps://maps.apple.com/?address=${encodeURIComponent(location)}`,
      bgColor: "bg-gray-500",
      hoverColor: "hover:bg-gray-600",
      Icon: ImAppleinc,
    },
    {
      name: "OpenStreetMap",
      url: `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`,
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      Icon: SiOpenstreetmap,
    },
  ];

  return (
    <div className="space-y-3 flex flex-col md:flex-row gap-2 items-center justify-center w-full">
      <div className="flex justify-center items-center w-full gap-2">
        <MapPin size={20} className="text-blue-100 mt-0.5 flex shrink-0" />
        <p className="font-semibold text-gray-200">{location}</p>
      </div>

      <div className="flex w-full flex-col gap-2">
        {mapLinks.map((link) => {
          const Icon = link.Icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-3 py-2 ${link.bgColor} ${link.hoverColor} text-white rounded-lg text-sm font-medium transition-colors`}
            >
              {Icon && <Icon size={18} />}

              {link.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}
