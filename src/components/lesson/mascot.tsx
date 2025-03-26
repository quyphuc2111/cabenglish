import { motion } from "framer-motion";
import { MASCOT_ANIMATIONS } from "@/constants/animations";
import OptimizeImage from "@/components/common/optimize-image";

const Mascot = ({ position }: { position: "left" | "right" }) => {
  return (
    <div
      className={`absolute ${
        position === "right" ? "top-1/2 right-10" : "top-1/3 left-10"
      }`}
    >
      <div className="relative">
        <motion.div animate={MASCOT_ANIMATIONS.float}>
          <OptimizeImage
            src={`/assets/image/bkt_mascot_pose${
              position === "right" ? "1" : "2"
            }.webp`}
            width={110}
            height={160}
            alt="bkt_mascot"
            className="flex-shrink-0"
            priority
          />
        </motion.div>
        {position == "left" && (
          <motion.div
            className="absolute -top-2 -right-14"
            animate={MASCOT_ANIMATIONS.dialog}
          >
            <OptimizeImage
              src="/assets/image/bkt_mascot_pose2_dialog.webp"
              width={80}
              height={80}
              alt="bkt_mascot_pose2_dialog"
              className="flex-shrink-0"
            />
          </motion.div>
        )}

        {position === "right" && (
          <>
            <motion.div
              className="absolute top-1 -left-5"
              animate={MASCOT_ANIMATIONS.ball}
            >
              <OptimizeImage
                src="/assets/image/bkt_mascot_pose1_ball.webp"
                width={40}
                height={40}
                alt="bkt_mascot_ball"
                className="flex-shrink-0"
              />
            </motion.div>

            <motion.div
              className="absolute top-5 -right-5"
              animate={MASCOT_ANIMATIONS.bear}
            >
              <OptimizeImage
                src="/assets/image/bkt_mascot_pose1_bear.webp"
                width={34}
                height={34}
                alt="bkt_mascot_pose1_bear"
                className="flex-shrink-0"
              />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Mascot;
