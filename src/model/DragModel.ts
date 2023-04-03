import { Emitter } from "./Emitter";
import { RefObject, Ref } from "react";

interface Event {
  update: [];
}

interface Options {
  x: number;
  y: number;
  el: HTMLElement | RefObject<HTMLElement>;
}

export class DragModel extends Emitter<Event> {
  /**
   * 距离容器左侧距离
   */
  private x = 0;
  /**
   * 距离容器右侧距离
   */
  private y = 0;
  /**
   * 需要拖拽的容器，可传入字符串，通过querySelector获取容器
   */
  private el: RefObject<HTMLElement> | HTMLElement;
  /**
   * 是否限制在父容器移动
   */
  private isLimitParent = true;
  /**
   * 按下时的坐标
   */
  private point = {
    startX: 0,
    startY: 0,
    memoX: 0,
    memoY: 0,
  };
  constructor(opt: Options) {
    super();
    this.x = opt.x;
    this.y = opt.y;
    this.el = opt.el;
  }
  /**
   * 获取相对容器X坐标
   */
  public getX() {
    this.x;
  }
  /**
   * 获取相对容器Y坐标
   */
  public getY() {
    this.y;
  }
  /**
   * 
   * 设置横坐标
   */
  public setX(x: number) {
    this.x = x;
    this.emit('update');
  }
  /**
   * 
   * 设置纵坐标
   */
  public setY(y: number) {
    this.y = y;
    this.emit('update');
  }
  /**
   * 设置目标元素
   */
  public setEl(el: HTMLElement) {
    this.el = el;
  }
  /**
   * 获取所有配置
   */
  public getConfig() {
    return {
      x: this.x,
      y: this.y,
    };
  }
  /**
   * 鼠标按下时处理函数
   */
  public onMouseDown(ev: MouseEvent) {
    this.removeSelection();
    this.point = {
      startX: ev.clientX,
      startY: ev.clientY,
      memoX: this.x,
      memoY: this.y,
    };
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  /**
   * 鼠标移动的处理函数
   */
  public onMouseMove = (ev: MouseEvent) => {
    if (this.el === null) {
      return;
    }
    let element = null;
    if ("current" in this.el) {
      element = this.el.current;
    } else {
      element = this.el;
    }
    this.removeSelection();
    const diffX = ev.clientX - this.point.startX;
    const diffY = ev.clientY - this.point.startY;
    this.x = diffX + this.point.memoX;
    this.y = diffY + this.point.memoY;
    if (!this.isLimitParent) {
      this.emit("update");
      return;
    }
    const parentRect = (
      element?.parentNode as HTMLElement
    ).getBoundingClientRect();
    const elementReact = element?.getBoundingClientRect();
    // 不能左移
    if (this.x < 0) {
      this.x = 0;
    }
    // 不能上移
    if (this.y < 0) {
      this.y = 0;
    }
    // 不能右移
    if (
      parentRect &&
      elementReact &&
      this.x > parentRect.width - elementReact.width
    ) {
      this.x = parentRect.width - elementReact.width;
    }
    // 不能下移
    if (
      parentRect &&
      elementReact &&
      this.y > parentRect.height - elementReact.height
    ) {
      this.y = parentRect.height - elementReact.height;
    }
    this.emit("update");
  };
  /**
   * 鼠标释放时的处理函数
   */
  public onMouseUp = (ev: MouseEvent) => {
    this.point = {
      startX: 0,
      startY: 0,
      memoX: this.x,
      memoY: this.y,
    };
    document.removeEventListener("mousemove", this.onMouseMove);
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

export default DragModel;
