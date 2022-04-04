import { isPromise, isFunction } from './common';
import logger from './logger';

export interface EvoData {
  state: Record<string, any>;
  param: null | Record<string, any>;
}

export class FlowExec {
  isPending = false;

  tasks: any[] = [];

  state: Record<string, any> = {};

  constructor(state: Record<string, any>) {
    this.state = state;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public exec = (fn: any): FlowExec => {
    if (this.isPending) {
      this.tasks.push(fn);
    } else {
      this.do(fn, { state: this.state, param: null });
    }
    return this;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public next = (option: any): void => {
    if (this.tasks.length) {
      this.do(this.tasks.shift(), { state: this.state, param: option });
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public do = (fn: any, option: any) => {
    const next = fn(option);
    if (isFunction(next)) {
      const nextOption = next();
      this.next(nextOption);
      return;
    }
    if (isPromise(next)) {
      this.isPending = true;
      next
        .then((res: any) => {
          this.isPending = false;
          this.next(res);
        })
        .catch((error: Error) => {
          this.isPending = false;
          logger.error('flow error with promise.');
          logger.error(error);
        });
      return;
    }
    if (next === 0) {
      this.next({});
    }
    if (next !== 0) {
      logger.info(
        `Task type error, now use ${Object.prototype.toString.call(next)}`
      );
    }
  };
}

export function flowsCompose(state: Record<string, any>): FlowExec {
  return new FlowExec(state);
}
