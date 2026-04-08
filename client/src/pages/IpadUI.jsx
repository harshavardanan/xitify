import React, { useEffect, useRef } from "react";
import Demo from "./Demo";
import { ContainerScroll } from "../components/ui/container-scroll-animation";

export function IpadUI() {
  return (
    <div className="flex flex-col overflow-hidden ">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Xitify Editor
              </span>
            </h1>
          </>
        }
      >
        <div className="mx-auto rounded-2xl object-cover h-full object-left-top">
          <Demo />
        </div>
      </ContainerScroll>
    </div>
  );
}
