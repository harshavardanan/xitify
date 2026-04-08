import React from "react";

const AnimatedSvg = () => {
  return (
    <div className="min-h-[200px] bg-gray-900 flex items-center justify-center p-4">
      <style>
        {`
          #cursor,
          #box,
          #text-container {
            cursor: pointer;
          }
          #cursor {
            overflow: visible;
            transform: translate3d(300px, 0, 0) scale(1);
            transform-origin: center center;
            transform-box: fill-box;
            animation: cursor 8s ease infinite alternate;
          }
          @keyframes cursor {
            0% {
              opacity: 0;
              transform: translate3d(250px, 100px, 0) scale(1);
            }
            30% {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
            }
            60% {
              opacity: 1;
              transform: translate3d(-250px, -100px, 0) scale(1);
            }
            /* clique */
            65% {
              opacity: 1;
              transform: translate3d(-250px, -100px, 0) scale(0.95);
            }
            70% {
              opacity: 1;
              transform: translate3d(-250px, -100px, 0) scale(1);
            }
            100% {
              opacity: 1;
              transform: translate3d(-300px, -50px, 0) scale(1);
            }
          }
          #box {
            opacity: 0;
            animation: box 8s ease infinite alternate;
          }
          @keyframes box {
            0%,
            60% {
              opacity: 0;
            }
            65%,
            100% {
              opacity: 1;
            }
          }
          
          /* Animation for the text phrases */
          @keyframes fadeText {
            0%, 25% { opacity: 1; }
            33%, 100% { opacity: 0; }
          }

          #text1 { animation: fadeText 9s ease-in-out infinite; }
          #text2 { animation: fadeText 9s ease-in-out infinite; animation-delay: 3s; }
          #text3 { animation: fadeText 9s ease-in-out infinite; animation-delay: 6s; }
        `}
      </style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 614 390"
        className="w-full max-w-2xl h-auto"
      >
        <g id="Frame">
          <g id="box-figma">
            {/* New text group replaces the old complex path */}
            <g
              id="text-container"
              fontFamily="monospace"
              fontSize="48"
              fontWeight="bold"
              fill="#F9F9F9"
              textAnchor="middle"
            >
              <text id="text1" x="307" y="170" dy=".3em" opacity="0">
                Edit todo
              </text>
              <text id="text2" x="307" y="170" dy=".3em" opacity="0">
                Collaboratively
              </text>
              <text id="text3" x="307" y="170" dy=".3em" opacity="0">
                Seamlessly
              </text>
            </g>

            <g id="box">
              <path
                strokeWidth="2"
                stroke="#2563EB"
                fillOpacity="0.05"
                fill="#2563EB"
                d="M587 20H28V306H587V20Z"
                id="figny9-box"
              ></path>
              <path
                strokeWidth="2"
                stroke="#2563EB"
                fill="white"
                d="M33 15H23V25H33V15Z"
                id="figny9-adjust-1"
              ></path>
              <path
                strokeWidth="2"
                stroke="#2563EB"
                fill="white"
                d="M33 301H23V311H33V301Z"
                id="figny9-adjust-3"
              ></path>
              <path
                strokeWidth="2"
                stroke="#2563EB"
                fill="white"
                d="M592 301H582V311H592V301Z"
                id="figny9-adjust-4"
              ></path>
              <path
                strokeWidth="2"
                stroke="#2563EB"
                fill="white"
                d="M592 15H582V25H592V15Z"
                id="figny9-adjust-2"
              ></path>
            </g>
            <g id="cursor">
              <path
                strokeWidth="2"
                stroke="white"
                fill="#2563EB"
                d="M453.383 343L448 317L471 331L459.745 333.5L453.383 343Z"
                id="Vector 273"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedSvg;
