import {
  useCallback,
  useState,
  MouseEvent,
  useRef,
  SyntheticEvent,
  Fragment,
} from "react";
import Styles from "./style.module.less";
import { Area } from "./Area";

export interface Props {
  src: string;
  width?: number;
  height?: number;
  area?: Hot[];
  onLoad?: (e: SyntheticEvent) => void;
}

export interface Hot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageHotArea = (props: Props) => {
  const { src, width, height, area = [], onLoad = () => {} } = props;

  const [hot, setHot] = useState(area);

  const containerRef = useRef<HTMLDivElement>(null);

  const onClickContainer = useCallback(
    (_e: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }
      const defaultHot = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
      };
      setHot([...hot, defaultHot]);
    },
    [containerRef, hot]
  );

  return (
    <Fragment>
      <div
        ref={containerRef}
        className={Styles.container}
        style={{ width, height }}
      >
        <img
          src={src}
          width={width}
          height={height}
          draggable={false}
          onLoad={onLoad}
        />
        {hot.map((item, index) => {
          return (
            <Area
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              key={item.x + index}
              container={containerRef}
            >
              {index}
            </Area>
          );
        })}
      </div>
      <button onClick={onClickContainer}>添加热区</button>
    </Fragment>
  );
};
