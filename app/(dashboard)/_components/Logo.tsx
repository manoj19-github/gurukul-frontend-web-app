import React, { FC } from "react";
import Image from "next/image";

interface LogoProps {}
const Logo: FC<LogoProps> = ({}): JSX.Element => {
  return (
    <div className="items-center flex-col flex justify-center relative md:pb-6 lg:pb-8">
      <Image height={130} width={130} alt="logo" src="/logo.png" />
      <p className="text-center absolute left-[32%] -bottom-[0%] lg:text-[25px] protest-riot-regular protest-riot-regular">
        Gurukul
      </p>
    </div>
  );
};

export default Logo;
