"use client";



import { ConcertCard } from "@/components/ConcertCard";

import type { Concert } from "@/lib/types";

import { motion, useReducedMotion } from "motion/react";



export function ConcertGrid({ concerts }: { concerts: Concert[] }) {

  const reduceMotion = useReducedMotion();



  const itemVariants = reduceMotion

    ? { hidden: {}, visible: {} }

    : {

        hidden: { opacity: 0, y: 8 },

        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },

      };



  return (

    <motion.div

      className="grid grid-cols-1 lg:grid-cols-2 gap-6"

      initial={reduceMotion ? false : "hidden"}

      animate="visible"

      variants={{

        visible: {

          transition: { staggerChildren: reduceMotion ? 0 : 0.05 },

        },

      }}

    >

      {concerts.map((concert) => (

        <motion.div key={concert.id} variants={itemVariants}>

          <ConcertCard concert={concert} />

        </motion.div>

      ))}

    </motion.div>

  );

}

