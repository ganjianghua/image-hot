import {
  useCallback,
  PropsWithChildren,
  useEffect,
  useRef,
  RefObject,
} from "react";
import Styles from "./style.module.less";
import { DragModel } from "../model/DragModel";
import { useSingleton } from "../hooks/useSingleton";
import { useUpdate } from "../hooks/useUpdate";
import { ResizeModel, ResizeDirection } from "../model/ResizeModel";

export interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  container: RefObject<HTMLDivElement>;
}

export const Area = (props: PropsWithChildren<Props>) => {
  const hotRef = useRef<HTMLDivElement>(null);

  const dragModel = useSingleton(
    () =>
      new DragModel({
        x: props.x,
        y: props.y,
        el: hotRef,
      })
  );
  const resizeModel = useSingleton(
    () =>
      new ResizeModel({
        w: props.width,
        h: props.height,
        el: hotRef,
        dragModel,
      })
  );
  const { x, y } = dragModel.getConfig();
  const { width, height } = resizeModel.getConfig();
  const update = useUpdate();

  const onHotMouseDown = useCallback(
    (ev: any) => {
      dragModel.onMouseDown(ev);
    },
    [dragModel]
  );

  const onRightBottom = useCallback(
    (ev: any) => {
      resizeModel.onMouseDown(ev, ResizeDirection.SEResize);
    },
    [resizeModel]
  );

  const onLeftBottom = useCallback(
    (ev: any) => {
      resizeModel.onMouseDown(ev, ResizeDirection.SWResize);
    },
    [resizeModel]
  );

  const onLeftTop = useCallback(
    (ev: any) => {
      resizeModel.onMouseDown(ev, ResizeDirection.NWResize);
    },
    [resizeModel]
  );

  const onRightTop = useCallback(
    (ev: any) => {
      resizeModel.onMouseDown(ev, ResizeDirection.NEResize);
    },
    [resizeModel]
  );

  useEffect(() => {
    dragModel.addListener("update", update);
    resizeModel.addListener("update", update);
    return () => {
      dragModel.removeListener("update", update);
      resizeModel.removeListener("update", update);
    };
  }, []);

  return (
    <div
      ref={hotRef}
      className={Styles.area}
      onMouseDown={onHotMouseDown}
      style={{
        width: width,
        height: height,
        left: x,
        top: y,
      }}
    >
      {props.children}
      {/* right-bottom */}
      <div className={Styles.rightBottom} onMouseDown={onRightBottom} />
      {/* left-bottom */}
      <div className={Styles.leftBottom} onMouseDown={onLeftBottom} />
      {/* left-top */}
      <div className={Styles.leftTop} onMouseDown={onLeftTop} />
      {/* right-top */}
      <div className={Styles.rightTop} onMouseDown={onRightTop} />
    </div>
  );
};
