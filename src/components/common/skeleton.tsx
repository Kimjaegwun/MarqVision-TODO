import styles from "./skeleton.module.css";

type SkeletonProps = {
  width: string;
  height: string;
};

const Skeleton = ({ width, height }: SkeletonProps) => {
  return <div className={styles.skeleton} style={{ width, height }} />;
};

export default Skeleton;
