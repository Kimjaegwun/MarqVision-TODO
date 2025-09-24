import styles from "./index.module.css";

type SkeletonProps = {
  width: string;
  height: string;
  className?: string;
};

const Skeleton = ({ width, height, className }: SkeletonProps) => {
  return <div className={`${styles.skeleton} ${className}`} style={{ width, height }} />;
};

export default Skeleton;
