import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

interface PortfolioImage {
  image: string;
}

// 12 portfolio images
const portfolios: PortfolioImage[] = [
  { image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1481481312836-8140e694d500?auto=format&fit=crop&q=80&w=600&h=400" },
  { image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600&h=400" },
];

const firstColumn = portfolios.slice(0, 4);
const secondColumn = portfolios.slice(4, 8);
const thirdColumn = portfolios.slice(8, 12);

const TestimonialsColumn = (props: {
  className?: string;
  portfolios: PortfolioImage[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.portfolios.map(({ image }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  className="rounded-3xl border border-neutral-200/20 shadow-lg shadow-black/20 overflow-hidden max-w-sm w-full bg-neutral-900 transition-all duration-300 cursor-default select-none group" 
                >
                  <img
                    src={image}
                    alt={`Portfolio showcase ${i}`}
                    className="w-full h-48 md:h-64 object-cover"
                  />
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

export default function TestimonialV2() {
  return (
    <div className="absolute inset-0 bg-transparent overflow-hidden pointer-events-none">
      <div 
        className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] h-[120vh]"
        role="region"
        aria-label="Scrolling Portfolios"
      >
        <TestimonialsColumn portfolios={firstColumn} duration={25} />
        <TestimonialsColumn portfolios={secondColumn} className="hidden md:block" duration={35} />
        <TestimonialsColumn portfolios={thirdColumn} className="hidden lg:block" duration={28} />
      </div>
    </div>
  );
}
