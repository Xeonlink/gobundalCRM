"use client";

import React, { SetStateAction, Suspense, useSyncExternalStore } from "react";

export interface Modal {
  key: number;
  ui: React.ReactNode;
}

export type ModalProps<T = {}> = T & {
  closeSelf?: () => void;
  ref?: (instance: HTMLDialogElement) => void;
};

class ModalClient {
  private modals: Modal[] = [];
  private subscribers = new Map<string, (modals: Modal[]) => any>();

  public get = <TSelected>(selector?: (modals: Modal[]) => TSelected) => {
    if (!!selector) return selector(this.modals);
    return this.modals;
  };

  public set = (modals: SetStateAction<Modal[]>) => {
    this.modals = typeof modals === "function" ? modals(this.modals) : modals;
    this.subscribers.forEach((subscriber) => subscriber(this.modals));
  };

  public open = (revealedUI: React.ReactNode, key: number = Math.round(Math.random() * 10000)) => {
    const originUI = revealedUI as any;

    const ui = {
      ...originUI,
      key,
      props: {
        ...originUI.props,
        closeSelf: () => this.set((prev) => prev.filter((m) => m.key !== key)),
        ref: (target: HTMLDialogElement | undefined) => target?.showModal(),
      },
    };

    const modal = { key, ui };
    this.set((prev) => [...prev, modal]);
    return key;
  };

  public close = (key: number) => {
    this.set((prev) => prev.filter((modal) => modal.key !== key));
  };

  public subscribe = (subscriber: (modals: Modal[]) => any) => {
    const subscriberId = crypto.randomUUID();
    this.subscribers.set(subscriberId, subscriber);
    return () => this.subscribers.delete(subscriberId);
  };
}

const modalClient = new ModalClient();

export function ModalPlacer() {
  const modals = useSyncExternalStore(modalClient.subscribe, () => modalClient.get((prev) => prev));

  return modals.map((modal) =>
    React.createElement(
      Suspense,
      { key: modal.key, fallback: React.createElement(ModalLoading, null) },
      modal.ui,
    ),
  );
}

function ModalLoading() {
  return React.createElement(
    "div",
    { className: "fixed flex h-screen w-screen items-center justify-center" },
    "Loading...",
  );
}

export function useModal() {
  return {
    open: modalClient.open.bind(modalClient),
    close: modalClient.close.bind(modalClient),
  };
}
