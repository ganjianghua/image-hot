import { RefObject } from "react";
import DragModel from "./DragModel";
import { Emitter } from "./Emitter";

interface Evens {
  update: [];
}

interface Options {
  w: number;
  h: number;
  el?: HTMLElement | RefObject<HTMLElement>;
  minW?: number;
  minH?: number;
  dragModel: DragModel;
}

export enum ResizeDirection {
  SEResize,
  SWResize,
  NWResize,
  NEResize,
}

export class ResizeModel extends Emitter<Evens> {
  /**
   * 宽度
   */
  private w = 0;
  /**
   * 高度
   */
  private h = 0;
  /**
   * 最小宽度
   */
  private minW = 20;
  /**
   * 最小高度
   */
  private minH = 20;
  /**
   * 需要缩放的容器
   */
  private el: RefObject<HTMLElement> | HTMLElement = document.body;
  private dragModel: DragModel;
  /**
   * 按下时的坐标
   */
  private point = {
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
    memoW: 0,
    memoH: 0,
    x: 0,
    y: 0,
  };
  constructor(opt: Options) {
    super();
    this.w = opt.w;
    this.h = opt.h;
    if (opt.minW) {
      this.minW = opt.minW;
    }
    if (opt.minH) {
      this.minH = opt.minH;
    }
    if (opt.el) {
      this.el = opt.el;
    }
    this.dragModel = opt.dragModel;
  }
  /**
   * 获取宽度
   */
  public getWidth() {
    return this.w;
  }
  /**
   * 获取高度
   */
  public getHeight() {
    return this.h;
  }
  /**
   * 获取所有配置
   */
  public getConfig() {
    return {
      width: this.w,
      height: this.h,
    };
  }
  /**
   * 设置目标元素
   */
  public setElement(el: HTMLElement | null) {
    if (!el) {
      return;
    }
    this.el = el;
  }
  /**
   * 获取模版
   */
  public getEl(): HTMLElement {
    if ("current" in this.el) {
      return this.el.current as HTMLElement;
    }
    return this.el;
  }
  /**
   * 获取容器
   */
  public getContainer(): HTMLElement {
    return this.getEl().parentNode as HTMLElement;
  }
  /**
   * 鼠标按下时处理函数
   */
  public onMouseDown(ev: MouseEvent, type: ResizeDirection) {
    ev.stopPropagation();
    const rect = this.getEl().getBoundingClientRect();
    this.point.right = rect.right;
    this.point.bottom = rect.bottom;
    this.point.left = rect.left;
    this.point.top = rect.top;
    this.point.memoW = rect.width || 0;
    this.point.memoH = rect.height || 0;
    const { x, y } = this.dragModel.getConfig();
    this.point.x = x;
    this.point.y = y;
    document.addEventListener("mouseup", this.onMouseUp);
    switch (type) {
      case ResizeDirection.SEResize:
        document.addEventListener("mousemove", this.seResize);
        break;
      case ResizeDirection.SWResize:
        document.addEventListener("mousemove", this.swResize);
        break;
      case ResizeDirection.NEResize:
        document.addEventListener("mousemove", this.neResize);
        break;
      case ResizeDirection.NWResize:
        document.addEventListener("mousemove", this.nwResize);
        break;
      default:
    }
  }
  /**
   * 鼠标右下移动
   */
  public seResize = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.removeSelection();
    const containerRect = this.getContainer().getBoundingClientRect();
    let diffH = 0;
    let diffW = 0;
    // 不能下移
    if (ev.clientY >= containerRect.bottom) {
      diffH = containerRect.bottom - this.point.bottom;
    } else {
      diffH = ev.clientY - this.point.bottom;
    }
    // 不能右移
    if (ev.clientX >= containerRect.right) {
      diffW = containerRect.right - this.point.right;
    } else {
      diffW = ev.clientX - this.point.right;
    }
    this.w = this.point.memoW + diffW;
    this.h = this.point.memoH + diffH;
    this.limitMinWidthAndHeight();
    this.emit("update");
  };
  /**
   * 鼠标左下移动
   */
  public swResize = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.removeSelection();
    const containerRect = this.getContainer().getBoundingClientRect();
    let diffH = 0;
    let diffW = 0;
    // 不能左移
    if (ev.clientX <= containerRect.left) {
      diffW = this.point.left - containerRect.left;
    } else {
      diffW = this.point.left - ev.clientX;
    }
    // 不能下移
    if (ev.clientY >= containerRect.bottom) {
      diffH = containerRect.bottom - this.point.bottom;
    } else {
      diffH = ev.clientY - this.point.bottom;
    }

    this.w = this.point.memoW + diffW;
    this.h = this.point.memoH + diffH;
    // y轴不变，x轴变
    if (this.w >= this.minW) {
      const x = this.point.x - diffW;
      this.dragModel.setX(x);
    }
    this.limitMinWidthAndHeight();
    this.emit("update");
  };
  /**
   * 鼠标右上移动
   */
  public neResize = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.removeSelection();
    const containerRect = this.getContainer().getBoundingClientRect();
    let diffH = 0;
    let diffW = 0;
    // 不能右移
    if (ev.clientX >= containerRect.right) {
      diffW = containerRect.right - this.point.right;
    } else {
      diffW = ev.clientX - this.point.right;
    }
    // 不能上移
    if (ev.clientY <= containerRect.top) {
      diffH = this.point.top - containerRect.top;
    } else {
      diffH = this.point.top - ev.clientY;
    }
    this.w = this.point.memoW + diffW;
    this.h = this.point.memoH + diffH;
    if (this.h >= this.minW) {
      const y = this.point.y - diffH;
      this.dragModel.setY(y);
    }
    this.limitMinWidthAndHeight();
    this.emit("update");
  };
  /**
   * 鼠标左上移动
   */
  public nwResize = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.removeSelection();
    const containerRect = this.getContainer().getBoundingClientRect();
    let diffH = 0;
    let diffW = 0;
    // 不能左移
    if (ev.clientX <= containerRect.left) {
      diffW = this.point.left - containerRect.left;
    } else {
      diffW = this.point.left - ev.clientX;
    }
    // 不能上移
    if (ev.clientY <= containerRect.top) {
      diffH = this.point.top - containerRect.top;
    } else {
      diffH = this.point.top - ev.clientY;
    }
    this.w = this.point.memoW + diffW;
    this.h = this.point.memoH + diffH;
    if (this.w >= this.minW) {
      const x = this.point.x - diffW;
      this.dragModel.setX(x);
    }
    if (this.h >= this.minW) {
      const y = this.point.y - diffH;
      this.dragModel.setY(y);
    }
    this.limitMinWidthAndHeight();
    this.emit("update");
  }
  /**
   * 判断最小宽高
   */
  private limitMinWidthAndHeight() {
    if (this.w <= this.minW) {
      this.w = this.minW;
    }
    if (this.h <= this.minH) {
      this.h = this.minH;
    }
  }
  /**
   * 鼠标释放时的处理函数
   */
  public onMouseUp = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.point.right = 0;
    this.point.bottom = 0;
    this.point.memoW = this.w;
    this.point.memoH = this.h;
    document.removeEventListener("mousemove", this.seResize);
    document.removeEventListener("mousemove", this.swResize);
    document.removeEventListener("mousemove", this.neResize);
    document.removeEventListener("mousemove", this.nwResize);
    document.removeEventListener("mouseup", this.onMouseUp);
  };
  /**
   * 去除拖拽过程中，容器被选中方法
   */
  public removeSelection() {
    if (window.getSelection()) {
      window.getSelection()?.removeAllRanges();
      return;
    }
    document.getSelection()?.empty();
  }
}

export default ResizeModel;
