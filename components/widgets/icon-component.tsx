import { HTMLProps } from "react";
import { TICON_PATH } from "./icon-dictionary";

type TIconComponent = {
  icon: TICON_PATH;
  className?: HTMLProps<HTMLElement>["className"];
};

export const IconComponent: React.FC<TIconComponent> = ({
  className,
  icon = "logo",
}) => {
  return <img src={`/icons/${icon}.svg`} className={className} />;
};
