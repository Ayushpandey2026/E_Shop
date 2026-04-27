
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="bg-slate-200 rounded-2xl overflow-hidden"
  >
    <div className="w-full h-48 bg-slate-300 mb-4" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-300 rounded-full w-3/4" />
      <div className="h-3 bg-slate-300 rounded-full w-1/2" />
      <div className="h-3 bg-slate-300 rounded-full w-full" />
      <div className="h-10 bg-indigo-300 rounded-xl w-full mt-4" />
    </div>
  </motion.div>
);

const SkeletonImage = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="w-full h-48 bg-slate-300 rounded-2xl"
  />
);

const SkeletonText = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="h-4 bg-slate-300 rounded-full w-full"
  />
);

const SkeletonFullPage = () => (
  <div className="space-y-8 p-6">
    {/* Header */}
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="h-12 bg-slate-300 rounded-2xl w-1/3"
    />

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </>
    );
  }

  if (type === 'image') {
    return <SkeletonImage />;
  }

  if (type === 'text') {
    return <SkeletonText />;
  }

  if (type === 'fullpage') {
    return <SkeletonFullPage />;
  }

  return null;
};

export default SkeletonLoader;
