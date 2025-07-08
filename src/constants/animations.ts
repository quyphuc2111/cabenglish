export const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true
};

export const MASCOT_ANIMATIONS = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  ball: {
    y: [-15, 0, -15],
    x: [0, 5, 0],
    rotate: [0, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.5, 1]
    }
  },
  bear: {
    y: [0, -20, 0],
    x: [0, -10, 0],
    rotate: [0, -360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.5, 1]
    }
  },
  dialog: {
    y: [0, -20, 0],
    x: [0, 0, 0],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
  }
};
